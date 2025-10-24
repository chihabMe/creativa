"use server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { action } from "@/lib/actions/safe-action";
import { adminAction } from "@/lib/actions/safe-action";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { CACHE_TAGS } from "../constants";

// Schema for deleting an order
// Schema for creating a new order
const createOrderSchema = z.object({
  customerName: z.string().min(1, "Le nom est requis"),
  customerEmail: z.string().email("Email invalide"),
  customerPhone: z.string().min(1, "Le numéro de téléphone est requis"),
  shippingAddress: z.object({
    address: z.string().min(1, "L'adresse est requise"),
    city: z.string().min(1, "La ville est requise"),
    state: z.string().min(1, "La wilaya est requise"),
    postalCode: z.string().optional(),
  }),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number().min(1),
      size: z.string(),
      frame: z.string(),
      frameSubOption: z.string().optional(),
      image: z.string(),
    })
  ),
  total: z.number().min(0),
  paymentMethod: z.string().default("cash"),
  notes: z.string().optional(),
});

// Schema for updating an order status
const updateOrderStatusSchema = z.object({
  id: z.string(),
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

// Create a new order
export const createOrder = action
  .schema(createOrderSchema)
  .action(
    async ({
      parsedInput: {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        items,
        total,
        paymentMethod,
        notes,
      },
    }) => {
      try {
        // Generate a unique order number
        const orderNumber = `ORD-${nanoid(8).toUpperCase()}`;

        // Insert the order into the database
        const [result] = await db
          .insert(orders)
          .values({
            orderNumber,
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress: {
              ...shippingAddress,
              postalCode: shippingAddress.postalCode || "",
            },
            total,
            paymentMethod: paymentMethod || "cash",
            notes,
            status: "pending",
          })
          .returning({ id: orders.id });

        const orderId = result.id;

        // Insert order items
        for (const item of items) {
          await db.insert(orderItems).values({
            orderId: orderId.toString(),
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            frame: item.frame,
            subOption: item.frameSubOption,
          });
        } // Revalidate cache tags
        revalidateTag(CACHE_TAGS.orders);

        return {
          success: true,
          message: "Commande créée avec succès",
          orderId,
          orderNumber,
        };
      } catch (error) {
        console.error("Error creating order:", error);
        return {
          success: false,
          message: "Erreur lors de la création de la commande",
        };
      }
    }
  );

// Update an order's status
export const updateOrderStatus = adminAction
  .schema(updateOrderStatusSchema)
  .action(async ({ parsedInput }) => {
    try {
      await db
        .update(orders)
        .set({
          status: parsedInput.status,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, parsedInput.id));

      revalidateTag(CACHE_TAGS.orders);
      revalidatePath("/admin/orders");
      revalidatePath(`/admin/orders/${parsedInput.id}`);

      return {
        success: true,
        message: "Statut de la commande mis à jour avec succès",
      };
    } catch (error) {
      console.error("Error updating order status:", error);
      return {
        success: false,
        message: "Erreur lors de la mise à jour du statut de la commande",
      };
    }
  });

// Get all orders (for admin use)
// Get an order by ID
export async function getOrders({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
} = {}) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Get total count for pagination
    const totalOrders = await db.$count(orders);

    // Get paginated orders
    const data = await db.query.orders.findMany({
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      with: {
        orderItems: {
          with: {
            product: true,
          },
        },
      },
      limit: take,
      offset: skip,
    });

    return {
      orders: data,
      totalOrders,
      totalPages: Math.ceil(totalOrders / pageSize),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      orders: [],
      totalOrders: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
}
export async function getOrderById(id: string) {
  try {
    return await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        orderItems: {
          with: {
            product: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

// Get an order by order number
export async function getOrderByNumber(orderNumber: string) {
  try {
    return await db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber),
      with: {
        orderItems: {
          with: {
            product: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

// Delete an order
const deleteOrderSchema = z.object({
  id: z.string(),
});
export const deleteOrder = adminAction
  .schema(deleteOrderSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      // First delete all order items
      await db.delete(orderItems).where(eq(orderItems.orderId, id));

      // Then delete the order
      await db.delete(orders).where(eq(orders.id, id));

      revalidateTag(CACHE_TAGS.orders);
      revalidatePath("/admin/orders");

      return { success: true, message: "Commande supprimée avec succès" };
    } catch (error) {
      console.error("Error deleting order:", error);
      return {
        success: false,
        message: "Erreur lors de la suppression de la commande",
      };
    }
  });

// Get all orders with pagination (for admin use)
const getOrdersWithPaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10),
  status: z.string().default("all"),
  query: z.string().default(""),
});

export const getOrdersWithPagination = adminAction
  .schema(getOrdersWithPaginationSchema)
  .action(
    async ({
      parsedInput: { page = 1, limit = 10, status = "all", query = "" },
    }) => {
      try {
        const offset = (page - 1) * limit;

        // Get all orders first (we'll filter in JS for simplicity)
        const allOrders = await db.query.orders.findMany({
          orderBy: (orders, { desc }) => [desc(orders.createdAt)],
          with: {
            orderItems: {
              with: {
                product: true,
              },
            },
          },
        });

        // Filter orders based on search query and status
        const filteredOrders = allOrders.filter((order) => {
          const matchesQuery =
            !query ||
            order.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
            order.customerName.toLowerCase().includes(query.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(query.toLowerCase());

          const matchesStatus = status === "all" || order.status === status;

          return matchesQuery && matchesStatus;
        });

        // Get total count for pagination
        const totalCount = filteredOrders.length;

        // Paginate the filtered orders
        const paginatedOrders = filteredOrders.slice(offset, offset + limit);

        return {
          success: true,
          orders: paginatedOrders,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
        };
      } catch (error) {
        console.error("Error fetching orders:", error);
        return {
          success: false,
          orders: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page,
        };
      }
    }
  );

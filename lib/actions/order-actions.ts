"use server";
import { z } from "zod"
import { revalidatePath, revalidateTag } from "next/cache"
import { action } from "@/lib/actions/safe-action"
import { adminAction } from "@/lib/actions/safe-action"
import { db } from "@/lib/db"
import { orders, orderItems } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { CACHE_TAGS } from "../data";

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
      image: z.string(),
    }),
  ),
  total: z.number().min(0),
  paymentMethod: z.string().default("cash"),
  notes: z.string().optional(),
})

// Schema for updating an order status
const updateOrderStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
})

// Create a new order
export const createOrder = action.schema(
  createOrderSchema).action(
  async ({parsedInput:{ customerName, customerEmail, customerPhone, shippingAddress, items, total, paymentMethod, notes }}) => {
    try {
      // Generate a unique order number
      const orderNumber = `ORD-${nanoid(8).toUpperCase()}`

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
        .returning({ id: orders.id })

      const orderId = result.id

      // Insert order items
      for (const item of items) {
        await db.insert(orderItems).values({
          orderId: orderId.toString(),
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          frame: item.frame,
        })
      }

      // Revalidate cache tags
      revalidateTag(CACHE_TAGS.orders)

      return {
        success: true,
        message: "Commande créée avec succès",
        orderId,
        orderNumber,
      }
    } catch (error) {
      console.error("Error creating order:", error)
      return { success: false, message: "Erreur lors de la création de la commande" }
    }
  },
)

// Update an order's status
export const updateOrderStatus = adminAction.schema(updateOrderStatusSchema).action(async ({parsedInput}) => {
  try {
    await db
      .update(orders)
      .set({
        status: parsedInput.status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, parsedInput.id))

    revalidateTag(CACHE_TAGS.orders)
    revalidatePath("/admin/orders")

    return { success: true, message: "Statut de la commande mis à jour avec succès" }
  } catch (error) {
    console.error("Error updating order status:", error)
    return { success: false, message: "Erreur lors de la mise à jour du statut de la commande" }
  }
})

// Get all orders (for admin use)
export async function getOrders() {
  try {
    return await db.query.orders.findMany({
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      with: {
        orderItems: {
          with: {
            product: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

// Get an order by ID
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
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
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
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}

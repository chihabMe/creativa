"use server"
import { z } from "zod"
import { revalidatePath, revalidateTag } from "next/cache"
import { adminAction } from "@/lib/actions/safe-action"
import { db } from "@/lib/db"
import { productCategories, products } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import slugify from "slugify"
import { CACHE_TAGS } from "@/lib/data"

// Schema for creating a product
const createProductSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  price: z.coerce.number().min(1, "Le prix doit être supérieur à 0"),
  description: z.string().optional(),
  stock: z.coerce.number().min(0, "Le stock ne peut pas être négatif"),
  badge: z.enum(["none", "new", "bestseller", "sale"]).default("none"),
  featured: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
  sizes: z
    .array(
      z.object({
        size: z.string(),
        price: z.coerce.number(),
      }),
    )
    .default([]),
  frames: z
    .array(
      z.object({
        frame: z.string(),
        price: z.coerce.number(),
      }),
    )
    .default([]),
})

// Schema for updating a product
const updateProductSchema = createProductSchema.extend({
  id: z.string(),
})

// Schema for deleting a product
const deleteProductSchema = z.object({
  id: z.string(),
})

// Create a new product
export const createProduct = adminAction.schema(createProductSchema).action(async ({parsedInput:{ name, featured, categoryIds, ...data }}) => {
  try {
    // Generate a slug from the name
    const slug = slugify(name, { lower: true, strict: true })

    // Insert the product into the database
    const result = await db.transaction(async (tx) => {
      // Insert the product
      const [product] = await tx
        .insert(products)
        .values({
          name,
          slug,
          featured,
          ...data,
        })
        .returning({ id: products.id })

      // Insert product-category relationships
      if (categoryIds.length > 0) {
        await tx.insert(productCategories).values(
          categoryIds.map((categoryId) => ({
            productId: product.id,
            categoryId,
          })),
        )
      }

      return product
    })

    // Revalidate cache tags
    revalidateTag(CACHE_TAGS.products)

    // If the product is featured, also revalidate the featured tag
    if (featured) {
      revalidateTag(CACHE_TAGS.featured)
    }

    // Revalidate the categories tag if categories are provided
    if (categoryIds && categoryIds.length > 0) {
      revalidateTag(CACHE_TAGS.categories)
    }

    revalidatePath("/admin/products")
    revalidatePath("/")
    revalidatePath("/category/[slug]", "page")
    revalidatePath("/products/[id]", "page")

    return { success: true, message: "Produit créé avec succès" }
  } catch (error) {
    console.error("Error creating product:", error)
    return { success: false, message: "Erreur lors de la création du produit" }
  }
})


// Update an existing product
export const updateProduct = adminAction.schema(updateProductSchema).action( async ({parsedInput:{ id, name, featured, categoryIds, ...data }}) => {
  try {
    // Get the current product to check if featured status changed
    const currentProduct = await db.query.products.findFirst({
      where: eq(products.id, id),
    })

    // Generate a slug from the name
    const slug = slugify(name, { lower: true, strict: true })

    // Update the product in the database
    await db.transaction(async (tx) => {
      // Update the product
      await tx
        .update(products)
        .set({
          name,
          slug,
          featured,
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))

      // Delete existing product-category relationships
      await tx.delete(productCategories).where(eq(productCategories.productId, id))

      // Insert new product-category relationships
      if (categoryIds.length > 0) {
        await tx.insert(productCategories).values(
          categoryIds.map((categoryId) => ({
            productId: id,
            categoryId,
          })),
        )
      }
    })

    // Revalidate cache tags
    revalidateTag(CACHE_TAGS.products)

    // If the featured status changed or the product is featured, revalidate the featured tag
    if (featured || (currentProduct && currentProduct.featured)) {
      revalidateTag(CACHE_TAGS.featured)
    }

    // Revalidate the categories tag if categories are provided or changed
    if (categoryIds && categoryIds.length > 0) {
      revalidateTag(CACHE_TAGS.categories)
    }

    revalidatePath("/admin/products")
    revalidatePath("/")
    revalidatePath("/category/[slug]", "page")
    revalidatePath(`/products/${id}`)

    return { success: true, message: "Produit mis à jour avec succès" }
  } catch (error) {
    console.error("Error updating product:", error)
    return { success: false, message: "Erreur lors de la mise à jour du produit" }
  }
})


// Delete a product
export const deleteProduct = adminAction.schema(deleteProductSchema).action( async ({parsedInput:{ id }}) => {
  try {
    // Get the product before deleting to check if it's featured
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    })

    // Delete the product from the database
    // Note: The product-category relationships will be automatically deleted due to the CASCADE constraint
    await db.delete(products).where(eq(products.id, id))

    // Revalidate cache tags
    revalidateTag(CACHE_TAGS.products)

    // If the product was featured, also revalidate the featured tag
    if (product && product.featured) {
      revalidateTag(CACHE_TAGS.featured)
    }

    // Always revalidate the categories tag since we don't know which categories were associated
    revalidateTag(CACHE_TAGS.categories)

    revalidatePath("/admin/products")
    revalidatePath("/")
    revalidatePath("/category/[slug]", "page")

    return { success: true, message: "Produit supprimé avec succès" }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false, message: "Erreur lors de la suppression du produit" }
  }
})

// Get all products (for admin use - no caching)
export async function getProducts() {
  try {
    const productsData = await db.query.products.findMany({
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      with: {
        productCategories: {
          with: {
            category: true,
          },
        },
      },
    })

    // Transform the data to include category information
    return productsData.map((product) => ({
      ...product,
      categories: product.productCategories.map((pc) => pc.category.slug),
      categoryIds: product.productCategories.map((pc) => pc.category.id),
    }))
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getAdminProducts({
  page = 1,
  pageSize = 10,
}: {
  page?: number
  pageSize?: number
} = {}) {
  try {
    const skip = (page - 1) * pageSize
    const take = pageSize

    // Get total count for pagination
    const totalProducts = await db.$count(products)
    
    // Get paginated products
    const data = await db.query.products.findMany({
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      limit: take,
      offset: skip,
      with: {
        productCategories: {
          with: {
            category: true,
          },
        },
      },
    })

    return {
      products:data,
      totalProducts,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: page,
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return {
      products: [],
      totalProducts: 0,
      totalPages: 0,
      currentPage: 1,
    }
  }
}

// Get a product by ID (for admin use - no caching)
export async function getProductById(id: string) {
  try {
    return await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        productCategories: {
          with: {
            category: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

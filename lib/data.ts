import { unstable_cache } from "next/cache"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { eq, like, desc, sql } from "drizzle-orm"

// Cache tags for different types of data
export const CACHE_TAGS = {
  products: "products",
  categories: "categories",
  featured: "featured",
  orders: "orders",
}

// Get all products with caching
export const getAllProducts = unstable_cache(
  async () => {
    try {
      return await db.query.products.findMany({
        orderBy: [desc(products.createdAt)],
      })
    } catch (error) {
      console.error("Error fetching all products:", error)
      return []
    }
  },
  ["all-products"],
  {
    tags: [CACHE_TAGS.products],
    revalidate: 3600, // Revalidate every hour
  },
)

// Get featured products with caching
export const getFeaturedProducts = unstable_cache(
  async (limit = 8) => {
    try {
      return await db.query.products.findMany({
        where: eq(products.featured, true),
        orderBy: [desc(products.createdAt)],
        limit,
      })
    } catch (error) {
      console.error("Error fetching featured products:", error)
      return []
    }
  },
  ["featured-products"],
  {
    tags: [CACHE_TAGS.products, CACHE_TAGS.featured],
    revalidate: 3600, // Revalidate every hour
  },
)

// Get products by category with caching
export const getProductsByCategory = unstable_cache(
  async (category: string) => {
    try {
      return await db.query.products.findMany({
        where: sql`${products.categories}::jsonb @> ${'["' + category + '"]'}::jsonb`,
        orderBy: [desc(products.createdAt)],
      })
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error)
      return []
    }
  },
  ["products-by-category"],
  {
    tags: [CACHE_TAGS.products, CACHE_TAGS.categories],
    revalidate: 3600, // Revalidate every hour
  },
)

// Get product by ID with caching
export const getProductById = unstable_cache(
  async (id: number) => {
    try {
      return await db.query.products.findFirst({
        where: eq(products.id, id),
      })
    } catch (error) {
      console.error(`Error fetching product by ID ${id}:`, error)
      return null
    }
  },
  ["product-by-id"],
  {
    tags: [CACHE_TAGS.products],
    revalidate: 3600, // Revalidate every hour
  },

)

// Get product by slug with caching
export const getProductBySlug = unstable_cache(
  async (slug: string) => {
    try {
      return await db.query.products.findFirst({
        where: eq(products.slug, slug),
      })
    } catch (error) {
      console.error(`Error fetching product by slug ${slug}:`, error)
      return null
    }
  },
  ["product-by-slug"],
  {
    tags: [CACHE_TAGS.products],
    revalidate: 3600, // Revalidate every hour
  },
)

// Search products with caching
export const searchProducts = unstable_cache(
  async (query: string) => {
    try {
      return await db.query.products.findMany({
        where: like(products.name, `%${query}%`),
        orderBy: [desc(products.createdAt)],
      })
    } catch (error) {
      console.error(`Error searching products with query ${query}:`, error)
      return []
    }
  },
  ["search-products"],
  {
    tags: [CACHE_TAGS.products],
    revalidate: 3600, // Revalidate every hour
  },
)

// Get related products with caching
export const getRelatedProducts = unstable_cache(
  async (productId: string, categorySlug: string, limit = 4) => {
    try {
      // Get products in the same category, excluding the current product
      return await db.query.products.findMany({
        where: sql`${products.id} != ${productId} AND ${products.categories}::jsonb @> ${'["' + categorySlug + '"]'}::jsonb`,
        orderBy: [desc(products.createdAt)],
        limit,
      })
    } catch (error) {
      console.error(`Error fetching related products for product ${productId}:`, error)
      return []
    }
  },
  ["related-products"],
  {
    tags: [CACHE_TAGS.products],
    revalidate: 3600, // Revalidate every hour
  },
)

// Get all unique categories with caching
export const getAllCategories = unstable_cache(
  async () => {
    try {
      const result = await db.query.products.findMany({
        columns: {
          categories: true,
        },
      })

      // Extract all unique categories
      const categoriesSet = new Set<string>()
      result.forEach((product) => {
        if (product.categories && Array.isArray(product.categories)) {
          product.categories.forEach((category) => categoriesSet.add(category))
        }
      })

      return Array.from(categoriesSet)
    } catch (error) {
      console.error("Error fetching all categories:", error)
      return []
    }
  },
  ["all-categories"],
  {
    tags: [CACHE_TAGS.categories],
    revalidate: 3600, // Revalidate every hour
  },
)

// Get products by IDs with caching
export const getProductsByIds = unstable_cache(
  async (ids: number[]) => {
    try {
      if (ids.length === 0) return []

      return await db.query.products.findMany({
        where: sql`${products.id} IN (${ids.join(",")})`,
      })
    } catch (error) {
      console.error(`Error fetching products by IDs:`, error)
      return []
    }
  },
  ["products-by-ids"],
  {
    tags: [CACHE_TAGS.products],
    revalidate: 3600, // Revalidate every hour
  },
)

"use server";
import { unstable_cache } from "next/cache"
import { db } from "@/lib/db"
import { products, categories, productCategories, orders, users } from "@/lib/db/schema"
import { eq, like, desc, sql, and, sum, gte, count, lt } from "drizzle-orm"
import { CACHE_TAGS } from "./constants";


// Get all products with caching
export const getAllProducts = unstable_cache(
  async () => {
    try {
      const productsData = await db.query.products.findMany({
        orderBy: [desc(products.createdAt)],
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
      }))
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
      const productsData = await db.query.products.findMany({
        where: eq(products.featured, true),
        orderBy: [desc(products.createdAt)],
        limit,
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
      }))
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
  async (categorySlug: string) => {
    try {
      // First, find the category ID from the slug
      const category = await db.query.categories.findFirst({
        where: eq(categories.slug, categorySlug),
        columns: {
          id: true,
        },
      })

      if (!category) return []

      // Then, find all products in that category
      const productsData = await db.query.productCategories.findMany({
        where: eq(productCategories.categoryId, category.id),
        with: {
          product: {
            with: {
              productCategories: {
                with: {
                  category: true,
                },
              },
            },
          },
        },
        // orderBy: (pc, { desc }) => [desc(pc.productId.createdAt)],
      })

      // Transform the data to include category information
      return productsData.map((pc) => ({
        ...pc.product,
        categories: pc.product.productCategories.map((innerPc) => innerPc.category.slug),
      }))
    } catch (error) {
      console.error(`Error fetching products by category ${categorySlug}:`, error)
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
  async (id: string) => {
    try {
      const product = await db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
          productCategories: {
            with: {
              category: true,
            },
          },
        },
      })

      if (!product) return null

      // Transform the data to include category information
      return {
        ...product,
        categories: product.productCategories.map((pc) => pc.category.slug),
      }
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
      const product = await db.query.products.findFirst({
        where: eq(products.slug, slug),
        with: {
          productCategories: {
            with: {
              category: true,
            },
          },
        },
      })

      if (!product) return null

      // Transform the data to include category information
      return {
        ...product,
        categories: product.productCategories.map((pc) => pc.category.slug),
      }
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
      const productsData = await db.query.products.findMany({
        where: like(products.name, `%${query}%`),
        orderBy: [desc(products.createdAt)],
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
      }))
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
  async (productId: number, categorySlug: string, limit = 4) => {
    try {
      // First, find the category ID from the slug
      const category = await db.query.categories.findFirst({
        where: eq(categories.slug, categorySlug),
        columns: {
          id: true,
        },
      })

      if (!category) return []

      // Then, find all products in that category, excluding the current product
      const productsData = await db.query.productCategories.findMany({
        where: and(eq(productCategories.categoryId, category.id), sql`${productCategories.productId} != ${productId}`),
        with: {
          product: {
            with: {
              productCategories: {
                with: {
                  category: true,
                },
              },
            },
          },
        },
        // orderBy: (pc, { desc }) => [desc(pc.productId.createdAt)],
        limit,
      })

      // Transform the data to include category information
      return productsData.map((pc) => ({
        ...pc.product,
        categories: pc.product.productCategories.map((innerPc) => innerPc.category.slug),
      }))
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
      return await db.query.categories.findMany({
        orderBy: [sql`${categories.displayOrder} ASC, ${categories.name} ASC`],
      })
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

      const productsData = await db.query.products.findMany({
        where: sql`${products.id} IN (${ids.join(",")})`,
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
      }))
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

// Get all categories from the categories table with caching
export const getCategoriesFromDB = unstable_cache(
  async () => {
    try {
      return await db.query.categories.findMany({
        orderBy: [sql`${categories.displayOrder} ASC, ${categories.name} ASC`],
      })
    } catch (error) {
      console.error("Error fetching categories from DB:", error)
      return []
    }
  },
  ["categories-from-db"],
  {
    tags: [CACHE_TAGS.categories],
    revalidate: 3600, // Revalidate every hour
  },
)

// Get featured categories with caching
export const getFeaturedCategoriesFromDB = unstable_cache(
  async () => {
    try {
      return await db.query.categories.findMany({
        where: eq(categories.featured, true),
        orderBy: [sql`${categories.displayOrder} ASC, ${categories.name} ASC`],
      })
    } catch (error) {
      console.error("Error fetching featured categories:", error)
      return []
    }
  },
  ["featured-categories"],
  {
    tags: [CACHE_TAGS.categories, CACHE_TAGS.featured],
    revalidate: 3600, // Revalidate every hour
  },
)

// Get categories by group with caching
export const getCategoriesByGroupFromDB = unstable_cache(
  async () => {
    try {
      const allCategories = await db.query.categories.findMany({
        orderBy: [sql`${categories.displayOrder} ASC, ${categories.name} ASC`],
      })

      // Group categories by groupName
      const groupedCategories = allCategories.reduce(
        (acc, category) => {
          const groupName = category.groupName || "Autres"
          if (!acc[groupName]) {
            acc[groupName] = []
          }
          acc[groupName].push(category)
          return acc
        },
        {} as Record<string, typeof allCategories>,
      )

      return groupedCategories
    } catch (error) {
      console.error("Error fetching categories by group:", error)
      return {}
    }
  },
  ["categories-by-group"],
  {
    tags: [CACHE_TAGS.categories],
    revalidate: 3600, // Revalidate every hour
  },
)

// Get category by slug with caching
export const getCategoryBySlugFromDB = unstable_cache(
  async (slug: string) => {
    try {
      return await db.query.categories.findFirst({
        where: eq(categories.slug, slug),
      })
    } catch (error) {
      console.error(`Error fetching category by slug ${slug}:`, error)
      return null
    }
  },
  ["category-by-slug"],
  {
    tags: [CACHE_TAGS.categories],
    revalidate: 3600, // Revalidate every hour
  },
)


// Cache tags for dashboard data
const DASHBOARD_CACHE_TAGS = {
  dashboardStats: "dashboard-stats",
  recentOrders: "recent-orders",
  lowStockProducts: "low-stock-products",
  salesAnalytics: "sales-analytics"
}

// Get dashboard overview statistics
export const getDashboardStats = unstable_cache(
  async () => {
    try {
      // Total sales (sum of all order totals)
      const salesResult = await db
        .select({ totalSales: sum(orders.total) })
        .from(orders)
      
      // Total orders count
      const ordersResult = await db
        .select({ count: count() })
        .from(orders)
      
      // Total products count
      const productsResult = await db
        .select({ count: count() })
        .from(products)
      
      // Total customers (users with role "user")
      const customersResult = await db
        .select({ count: count() })
        .from(users)
        .where(eq(users.role, "user"))

      // Get month-over-month growth for sales
      const currentDate = new Date()
      const firstDayCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const firstDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      const firstDayTwoMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1)

      // Current month sales
      const currentMonthSales = await db
        .select({ total: sum(orders.total) })
        .from(orders)
        .where(gte(orders.createdAt, firstDayCurrentMonth))

      // Previous month sales
      const previousMonthSales = await db
        .select({ total: sum(orders.total) })
        .from(orders)
        .where(
          and(
            gte(orders.createdAt, firstDayLastMonth),
            lt(orders.createdAt, firstDayCurrentMonth)
          )
        )

      // Calculate growth percentages
      const salesGrowth = calculateGrowthPercentage(
        (parseFloat(previousMonthSales[0].total ?? "0") || 0),
        parseFloat(currentMonthSales[0].total ?? "0") || 0
      )

      // Similar queries for orders, products, and customers growth
      const currentMonthOrders = await db
        .select({ count: count() })
        .from(orders)
        .where(gte(orders.createdAt, firstDayCurrentMonth))

      const previousMonthOrders = await db
        .select({ count: count() })
        .from(orders)
        .where(
          and(
            gte(orders.createdAt, firstDayLastMonth),
            lt(orders.createdAt, firstDayCurrentMonth)
          )
        )

      const ordersGrowth = calculateGrowthPercentage(
        previousMonthOrders[0].count || 0,
        currentMonthOrders[0].count || 0
      )

      // New products added this month
      const newProductsThisMonth = await db
        .select({ count: count() })
        .from(products)
        .where(gte(products.createdAt, firstDayCurrentMonth))

      const productsGrowth = (newProductsThisMonth[0].count || 0) / (productsResult[0].count || 1) * 100

      // Customer growth
      const currentMonthCustomers = await db
        .select({ count: count() })
        .from(users)
        .where(
          and(
            eq(users.role, "user"),
            gte(users.createdAt, firstDayCurrentMonth)
          )
        )

      const previousMonthCustomers = await db
        .select({ count: count() })
        .from(users)
        .where(
          and(
            eq(users.role, "user"),
            gte(users.createdAt, firstDayLastMonth),
            lt(users.createdAt, firstDayCurrentMonth)
          )
        )

      const customersGrowth = calculateGrowthPercentage(
        previousMonthCustomers[0].count || 0,
        currentMonthCustomers[0].count || 0
      )

      return {
        totalSales: salesResult[0].totalSales || 0,
        totalOrders: ordersResult[0].count || 0,
        totalProducts: productsResult[0].count || 0,
        totalCustomers: customersResult[0].count || 0,
        salesGrowth,
        ordersGrowth,
        productsGrowth,
        customersGrowth
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      return {
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        salesGrowth: 0,
        ordersGrowth: 0,
        productsGrowth: 0,
        customersGrowth: 0
      }
    }
  },
  ["dashboard-stats"],
  {
    tags: [DASHBOARD_CACHE_TAGS.dashboardStats],
    revalidate: 3600, // Revalidate every hour
  }
)

// Helper function to calculate growth percentage
function calculateGrowthPercentage(previous: number, current: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// Get recent orders with customer information
export const getRecentOrders = unstable_cache(
  async (limit = 5) => {
    try {
      return await db.query.orders.findMany({
        orderBy: [desc(orders.createdAt)],
        limit,
        with: {
          user: true
        }
      })
    } catch (error) {
      console.error("Error fetching recent orders:", error)
      return []
    }
  },
  ["recent-orders"],
  {
    tags: [DASHBOARD_CACHE_TAGS.recentOrders],
    revalidate: 1800, // Revalidate every 30 minutes
  }
)

// Get low stock products
export const getLowStockProducts = unstable_cache(
  async (threshold = 5, limit = 10) => {
    try {
      return await db.query.products.findMany({
        where: lt(products.stock, threshold),
        orderBy: [products.stock],
        limit
      })
    } catch (error) {
      console.error("Error fetching low stock products:", error)
      return []
    }
  },
  ["low-stock-products"],
  {
    tags: [DASHBOARD_CACHE_TAGS.lowStockProducts],
    revalidate: 3600, // Revalidate every hour
  }
)

// Get sales analytics by time period
export const getSalesAnalytics = unstable_cache(
  async (period: "daily" | "weekly" | "monthly" = "monthly", limit = 6) => {
    try {
      let timeFormat: string
      let periodLabel: string
      
      // Set SQL date format based on period
      switch (period) {
        case "daily":
          timeFormat = "YYYY-MM-DD"
          periodLabel = "day"
          break
        case "weekly":
          timeFormat = "YYYY-WW" // ISO week
          periodLabel = "week"
          break
        case "monthly":
        default:
          timeFormat = "YYYY-MM"
          periodLabel = "month"
          break
      }

      const result = await db.execute(sql`
        SELECT 
          TO_CHAR(created_at, ${timeFormat}) as time_period,
          SUM(total) as revenue,
          COUNT(*) as orders
        FROM 
          orders
        GROUP BY 
          time_period
        ORDER BY 
          time_period DESC
        LIMIT ${limit}
      `)

      return result.map((row: any) => ({
        period: row.time_period,
        revenue: parseInt(row.revenue) || 0,
        orders: parseInt(row.orders) || 0
      }))
    } catch (error) {
      console.error("Error fetching sales analytics:", error)
      return []
    }
  },
  ["sales-analytics"],
  {
    tags: [DASHBOARD_CACHE_TAGS.salesAnalytics],
    revalidate: 3600, // Revalidate every hour
  }
)

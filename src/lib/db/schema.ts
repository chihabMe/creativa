import { relations } from "drizzle-orm"
import { pgTable, primaryKey, text, timestamp, boolean, pgEnum, json, uuid, integer } from "drizzle-orm/pg-core"

// Enums
export const orderStatusEnum = pgEnum("order_status", ["pending", "processing", "shipped", "delivered", "cancelled"])
export const productBadgeEnum = pgEnum("product_badge", ["none", "new", "bestseller", "sale"])

// Users table (for authentication)
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  featured: boolean("featured").default(false),
  displayOrder: integer("display_order").default(0),
  groupName: text("group_name"), // For grouping in dropdown (e.g., "Modèles", "Catégories", "Styles")
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// Products table
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: integer("price").notNull(),
  stock: integer("stock").default(0).notNull(),
  badge: productBadgeEnum("badge").default("none"),
  featured: boolean("featured").default(false),
  images: json("images").$type<string[]>().default([]),
  sizes: json("sizes").$type<{ size: string; price: number }[]>().default([]),
  frames: json("frames").$type<{ frame: string; price: number }[]>().default([]),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// Product-Category junction table for many-to-many relationship
export const productCategories = pgTable(
  "product_categories",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.categoryId] }),
  }),
)

// Orders table
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  status: orderStatusEnum("status").default("pending").notNull(),
  total: integer("total").notNull(),
  shippingAddress: json("shipping_address").$type<{
    address: string
    city: string
    state: string
    postalCode: string
  }>(),
  paymentMethod: text("payment_method").default("cash"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

// Order items table
export const orderItems = pgTable(
  "order_items",
  {
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    price: integer("price").notNull(),
    size: text("size"),
    frame: text("frame"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.orderId, t.productId] }),
  }),
)

// Relations
export const categoriesRelations = relations(categories, ({ many, one }) => ({
  productCategories: many(productCategories),
}))

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  productCategories: many(productCategories),
}))

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
  product: one(products, {
    fields: [productCategories.productId],
    references: [products.id],
  }),
  category: one(categories, {
    fields: [productCategories.categoryId],
    references: [categories.id],
  }),
}))

export const ordersRelations = relations(orders, ({ many, one }) => ({
  orderItems: many(orderItems),
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}))

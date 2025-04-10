export interface Product {
  id: number
  name: string
  slug: string
  description?: string | null
  price: number
  stock: number
  badge: "none" | "new" | "bestseller" | "sale"
  featured: boolean
  images: string[]
  categories: string[]
  sizes?: { size: string; price: number }[]
  frames?: { frame: string; price: number }[]
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size: string
  frame: string
  image: string
}

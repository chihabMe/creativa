export interface Product {
  id: string
  name: string
  price: number
  image: string
  badge?: "NOUVEAU" | "TOP VENTE"
}

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
// import { ShoppingCart, Plus, Minus } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useToast } from "@/components/ui/use-toast"
// import { useCart } from "@/contexts/cart-context"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  badge?: "NOUVEAU" | "TOP VENTE"
  categories?: string[]
}

interface ProductCardProps {
  product: Product
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  // const { toast } = useToast()
  // const { items, addItem, updateQuantity, removeItem } = useCart()

  // Find if product is already in cart
  // const cartItem = items.find((item) => item.id === product.id)
  // const isInCart = !!cartItem
  const [showQuantity, setShowQuantity] = useState(false)

  // const handleAddToCart = () => {
  //   if (!isInCart) {
  //     addItem({
  //       id: product.id,
  //       name: product.name,
  //       price: product.price,
  //       quantity: 1,
  //       size: "1M×50CM", // Default size
  //       frame: "SANS", // Default frame
  //       image: product.image,
  //     })

  //     toast({
  //       title: "Produit ajouté au panier",
  //       description: `${product.name} a été ajouté à votre panier.`,
  //     })
  //   } else {
  //     setShowQuantity(true)
  //   }
  // }

  // const increaseQuantity = () => {
  //   if (cartItem) {
  //     updateQuantity(cartItem.id, cartItem.quantity + 1)
  //   }
  // }

  // const decreaseQuantity = () => {
  //   if (cartItem && cartItem.quantity > 1) {
  //     updateQuantity(cartItem.id, cartItem.quantity - 1)
  //   } else if (cartItem) {
  //     removeItem(cartItem.id)
  //     setShowQuantity(false)
  //   }
  // }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="overflow-hidden">
        <div className="relative">
          <Link href={`/products/${product.id}`}>
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </Link>
          {product.badge && (
            <div
              className={`absolute left-2 top-2 rounded-md px-2 py-1 text-xs font-semibold text-white ${
                product.badge === "NOUVEAU" ? "bg-red-500" : "bg-amber-500"
              }`}
            >
              {product.badge}
            </div>
          )}
        </div>
        <div className="p-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="mb-1 text-center text-sm font-medium">{product.name}</h3>
          </Link>
        </div>
        <div className="flex items-center justify-center p-4 pt-0">
          <span className="font-semibold">{product.price} DA</span>
        </div>
      </div>
    </motion.div>
  )
}

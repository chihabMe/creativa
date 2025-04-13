"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import * as motion from "motion/react-m"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/cart-context"
import WishlistButton from "@/components/wishlist-button"
import { Badge } from "@/components/ui/badge"
import { getFeaturedProducts } from "@/lib/data"

interface ProductCardProps {
  product: Awaited<ReturnType <typeof getFeaturedProducts>>[0]
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { items } = useCart()

  // Find if product is already in cart
  const cartItem = items.find((item) => item.id === product.id.toString())

  // Map badge enum to display text
  const getBadgeText = (badge: string) => {
    switch (badge) {
      case "new":
        return "NOUVEAU"
      case "bestseller":
        return "TOP VENTE"
      case "sale":
        return "PROMO"
      default:
        return null
    }
  }

  const badgeText = getBadgeText(product.badge || "")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="w-full h-full"
    >
      <Card className="overflow-hidden flex flex-col h-full">
        <div className="relative w-full">
          <Link href={`/products/${product.slug}`} className="block w-full">
            <div className="relative aspect-square overflow-hidden w-full">
              <Image
                src={(product.images?.[0]) || "/placeholder.svg"}
                className="object-cover object-center transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 300px"
                fill
                alt={product.name}
                priority
              />
            </div>
          </Link>
          {badgeText && (
            <div
              className={`absolute left-2 top-2 rounded-md px-2 py-1 text-xs font-semibold text-white ${
                product.badge === "new" ? "bg-red-500" : product.badge === "bestseller" ? "bg-amber-500" : "bg-blue-500"
              }`}
            >
              {badgeText}
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-grow">
          <Link href={`/products/${product.slug}`}>
            <h3 
              className="mb-1 text-sm text-center font-medium overflow-hidden text-ellipsis line-clamp-2 h-auto " 
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>
          {product.stock <= 0 && (
            <div className="mt-1 text-center">
              <Badge variant="destructive" className="text-xs">
                Rupture de stock
              </Badge>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <span className="font-semibold text-base md:text-lg">{product.price} DA</span>

          <div className="flex items-center gap-2">
            <WishlistButton productId={product.id} productName={product.name} variant="ghost" className="h-8 w-8" />
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
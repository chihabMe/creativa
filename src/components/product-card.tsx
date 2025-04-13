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
  // const { toast } = useToast()
  const { items} = useCart()

  // Find if product is already in cart
  const cartItem = items.find((item) => item.id === product.id.toString())
  // const isInCart = !!cartItem
  // const [showQuantity, setShowQuantity] = useState(false)

  // const handleAddToCart = () => {
  //   if (!isInCart) {
  //     addItem({
  //       id: product.id.toString(),
  //       name: product.name,
  //       price: product.price,
  //       quantity: 1,
  //       size: product.sizes && product.sizes.length > 0 ? product.sizes[0].size : "1M×50CM", // Default size
  //       frame: product.frames && product.frames.length > 0 ? product.frames[0].frame : "SANS", // Default frame
  //       image: product.images?.[0] || "/placeholder.svg",
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
    >
      <Card className="overflow-hidden flex flex-col h-full">
        <div className="relative">
          <Link href={`/products/${product.slug}`}>
            <div className="relative aspect-square overflow-hidden" style={{ width: "100%", height: "300px" }}>
              <Image
              src={(product.images?.[0]) || "/placeholder.svg"}
              className="object-center transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 300px"
              width={300}
              height={300}
              alt={product.name}
              style={{ width: "100%", height: "100%" }}
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
              className="mb-1 text-center font-medium h-4 md:h-10 overflow-hidden text-ellipsis whitespace-nowrap" 
              title={product.name}
            >
              {product.name.length > 30 ? `${product.name.slice(0, 30)}...` : product.name}
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
          <span className="font-semibold md:text-lg">{product.price} DA</span>

          <div className="flex items-center gap-2">
            {/* {showQuantity || isInCart ? (
              <div className="flex items-center">
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={decreaseQuantity}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="mx-2 w-6 text-center">{cartItem?.quantity || 0}</span>
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={increaseQuantity}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.stock > 0 ? "Ajouter" : "Indisponible"}
              </Button>
            )} */}
            <WishlistButton productId={product.id} productName={product.name} variant="ghost" className="h-8 w-8" />
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
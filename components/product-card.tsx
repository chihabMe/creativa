"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden">
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
        <CardContent className="p-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="mb-1 text-center text-sm font-medium">{product.name}</h3>
          </Link>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <span className="font-semibold">{product.price} DA</span>
          <Button size="sm" variant="outline" className="rounded-full">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

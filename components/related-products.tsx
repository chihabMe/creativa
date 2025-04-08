"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const relatedProducts = [
  {
    id: "101",
    name: "Bismillah beige feuille d'or",
    price: 2500,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "102",
    name: "Minimaliste Moutarde",
    price: 4800,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "103",
    name: "Flower Gold",
    price: 3000,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "104",
    name: "Abstrait rosée long",
    price: 3000,
    image: "/placeholder.svg?height=300&width=300",
  },
]

export default function RelatedProducts() {
  return (
    <section className="mt-16">
      <motion.h2
        className="mb-8 text-center text-2xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Vous pourriez aussi aimer
      </motion.h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {relatedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Link href={`/products/${product.id}`}>
              <Card className="overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-1 text-center text-sm font-medium">{product.name}</h3>
                </CardContent>
                <CardFooter className="flex justify-center p-4 pt-0">
                  <span className="font-semibold">{product.price} DA</span>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

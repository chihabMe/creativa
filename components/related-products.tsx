"use client"

import { motion } from "framer-motion"
import ProductCard from "./product-card"

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
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  )
}

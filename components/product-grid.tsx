"use client"

import { useState } from "react"
import { motion } from "motion/react"
import ProductCard from "./product-card"
import { getFeaturedProducts } from "@/lib/data";

interface ProductGridProps {
  products: Awaited<ReturnType <typeof getFeaturedProducts>>
  title?: string
}

export default function ProductGrid({ products, title = "Nouveauté" }: ProductGridProps) {
  const [visibleProducts, setVisibleProducts] = useState(12)

  const loadMore = () => {
    setVisibleProducts((prev) => prev + 8)
  }

  return (
    <section className="container mx-auto px-4 md:px-0 py-16">
      <motion.h2
        className="mb-12 text-center text-3xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, visibleProducts).map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
      {visibleProducts < products.length && (
        <div className="mt-12 flex justify-center">
          <motion.button
            className="rounded-md bg-black px-6 py-2 text-white transition-colors hover:bg-black/80"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMore}
          >
            Voir plus
          </motion.button>
        </div>
      )}
    </section>
  )
}

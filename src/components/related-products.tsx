"use client"

import * as motion from "motion/react-m"
import ProductCard from "./product-card"
import type { Product } from "@/lib/types"

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null
  }

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
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  )
}

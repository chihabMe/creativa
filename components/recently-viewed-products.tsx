"use client"

import { useEffect, useState } from "react"
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store"
import ProductGrid from "@/components/product-grid"
import { getFeaturedProducts } from "@/lib/data";

interface RecentlyViewedProductsProps {
  currentProductId?: string;
}
type Product =  Awaited<ReturnType <typeof getFeaturedProducts>>[0]

export default function RecentlyViewedProducts({ currentProductId }: RecentlyViewedProductsProps) {
  const { getItems } = useRecentlyViewedStore()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      // Get recently viewed product IDs, excluding the current product
      const recentIds = getItems()
        .filter((id) => id !== currentProductId)
        .slice(0, 4) // Limit to 4 products

      if (recentIds.length === 0) {
        setProducts([])
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/products/recently-viewed?ids=${recentIds.join(",")}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error("Error fetching recently viewed products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [getItems, currentProductId])

  if (isLoading || products.length === 0) {
    return null
  }

  return <ProductGrid products={products} title="Récemment consultés" />
}

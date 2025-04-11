"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/product-grid"
import { useWishlistStore } from "@/lib/store/wishlist-store"
import { getProductsByIds } from "@/lib/data"

type Product= Awaited<ReturnType<typeof getProductsByIds>>

export default function WishlistClient() {
  const { items } = useWishlistStore()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      if (items.length === 0) {
        setProducts([])
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/products/wishlist?ids=${items.join(",")}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error("Error fetching wishlist products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [items])

  if (isLoading) {
    return <div className="text-center py-12">Chargement de vos favoris...</div>
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="mb-2 text-xl font-semibold">Votre liste de favoris est vide</h2>
        <p className="mb-6 text-center text-gray-600">Vous n'avez pas encore ajouté de produits à vos favoris.</p>
        <Button asChild>
          <Link href="/">Découvrir nos produits</Link>
        </Button>
      </div>
    )
  }

  return <ProductGrid products={products} title="Mes Favoris" />
}

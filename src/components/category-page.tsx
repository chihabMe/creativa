"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import * as motion from "motion/react-m"
import { Filter, ChevronDown, Grid3X3, Grid2X2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import ProductCard from "@/components/product-card"
import Breadcrumb from "@/components/breadcrumb"
import { getProductsByCategory } from "@/lib/data"

// Category name mapping for display purposes
const categoryDisplayNames: Record<string, string> = {
  "grand-tableaux": "GRAND TABLEAUX",
  vases: "VASES",
  miroirs: "MIROIRS",
  bougies: "BOUGIES",
  islamique: "ISLAMIQUE",
  abstrait: "ABSTRAIT",
  botanique: "BOTANIQUE",
  minimaliste: "MINIMALISTE",
  moderne: "MODERNE",
  classique: "CLASSIQUE",
  contemporain: "CONTEMPORAIN",
  boheme: "BOHÈME",
  nouveautes: "NOUVEAUTÉS",
  collections: "COLLECTIONS",
  promotions: "PROMOTIONS",
  "meilleures-ventes": "MEILLEURES VENTES",
  exclusives: "EXCLUSIVES",
}
type Product = Awaited<ReturnType<typeof getProductsByCategory>>[0]

interface CategoryPageProps {
  category: string
  initialProducts: Product[]

}

export default function CategoryPage({ category, initialProducts }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [gridView, setGridView] = useState<"grid3" | "grid4">("grid4")
  const [priceRange, setPriceRange] = useState<string>("all")

  // Apply filters and sorting
  useEffect(() => {
    setIsLoading(true)

    // Create a copy of the initial products
    let filteredProducts = [...initialProducts]

    // Apply price filter if selected
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      filteredProducts = filteredProducts.filter((product) => {
        if (max) {
          return product.price >= min && product.price <= max
        } else {
          return product.price >= min
        }
      })
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filteredProducts = filteredProducts
          .filter((p) => p.badge === "new")
          .concat(filteredProducts.filter((p) => p.badge !== "new"))
        break
      case "bestsellers":
        filteredProducts = filteredProducts
          .filter((p) => p.badge === "bestseller")
          .concat(filteredProducts.filter((p) => p.badge !== "bestseller"))
        break
      // For "featured", we keep the original order
    }

    setProducts(filteredProducts)
    setIsLoading(false)
  }, [initialProducts, sortBy, priceRange])

  const displayName =
    categoryDisplayNames[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: displayName, href: `/category/${category}` }]} />
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">{displayName}</h1>
        <p className="mt-2 text-gray-600">{products.length} produits trouvés</p>
      </motion.div>

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtrer par prix
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setPriceRange("all")}>Tous les prix</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriceRange("0-2000")}>Moins de 2 000 DA</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriceRange("2000-4000")}>2 000 DA - 4 000 DA</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriceRange("4000-6000")}>4 000 DA - 6 000 DA</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriceRange("6000-")}>Plus de 6 000 DA</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden sm:flex">
            <Button
              variant={gridView === "grid4" ? "default" : "outline"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setGridView("grid4")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={gridView === "grid3" ? "default" : "outline"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setGridView("grid3")}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="w-full sm:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Produits vedettes</SelectItem>
              <SelectItem value="price-low-high">Prix: croissant</SelectItem>
              <SelectItem value="price-high-low">Prix: décroissant</SelectItem>
              <SelectItem value="newest">Nouveautés</SelectItem>
              <SelectItem value="bestsellers">Meilleures ventes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div
          className={`grid gap-6 ${
            gridView === "grid4"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          }`}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="mb-2 text-xl font-semibold">Aucun produit trouvé</h2>
          <p className="mb-6 text-center text-gray-600">
            Nous n'avons pas trouvé de produits correspondant à cette catégorie.
          </p>
          <Link href="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            gridView === "grid4"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          }`}
        >
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { Filter, ChevronDown, Grid3X3, Grid2X2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useCartStore } from "@/lib/store"

// Sample product data - in a real app, this would come from an API or database
const allProducts = [
  {
    id: "1",
    name: "ISLAMIQUE NUANCE DE MARRON",
    price: 3900,
    categories: ["islamique", "marron", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
    badge: "NOUVEAU",
  },
  {
    id: "2",
    name: "Cadre volume - orange marron beige abstrait",
    price: 3800,
    categories: ["abstrait", "orange", "marron", "beige"],
    image: "/placeholder.svg?height=400&width=400",
    badge: "NOUVEAU",
  },
  {
    id: "3",
    name: "Islamique dor fond marbre",
    price: 3900,
    categories: ["islamique", "dore", "marbre", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
    badge: "NOUVEAU",
  },
  {
    id: "4",
    name: "Automne vibes",
    price: 3900,
    categories: ["automne", "moderne", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
    badge: "NOUVEAU",
  },
  {
    id: "5",
    name: "Botanique rose",
    price: 3900,
    categories: ["botanique", "rose", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "6",
    name: "Branche d'arbre Gold",
    price: 3000,
    categories: ["botanique", "dore", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
    badge: "NOUVEAU",
  },
  {
    id: "7",
    name: "Trio-kallimini -cand ( modèle mixte clai )",
    price: 3900,
    categories: ["moderne", "minimaliste", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
    badge: "NOUVEAU",
  },
  {
    id: "8",
    name: "Botanique beige vert",
    price: 3900,
    categories: ["botanique", "beige", "vert", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
    badge: "TOP VENTE",
  },
  {
    id: "9",
    name: "Abstrait Montagne beige Noir",
    price: 4800,
    categories: ["abstrait", "montagne", "beige", "noir", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
    badge: "TOP VENTE",
  },
  {
    id: "10",
    name: "The Trend Node",
    price: 3800,
    categories: ["moderne", "minimaliste", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
    badge: "TOP VENTE",
  },
  {
    id: "11",
    name: "Mandala Marron TOILE",
    price: 3200,
    categories: ["mandala", "marron", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "12",
    name: "Plume Bleu",
    price: 4400,
    categories: ["plume", "bleu", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "13",
    name: "Botanique marron vert",
    price: 4800,
    categories: ["botanique", "marron", "vert", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "14",
    name: "Flower beige esthétie",
    price: 3900,
    categories: ["fleur", "beige", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
    badge: "NOUVEAU",
  },
  {
    id: "15",
    name: "Marron minimaliste line",
    price: 3900,
    categories: ["minimaliste", "marron", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "16",
    name: "Boho Vert",
    price: 4800,
    categories: ["boho", "vert", "grand-tableaux"],
    image: "/placeholder.svg?height=400&width=400",
  },
  // Vases
  {
    id: "17",
    name: "Vase Céramique Blanc",
    price: 2500,
    categories: ["vases", "ceramique", "blanc"],
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "18",
    name: "Vase Verre Fumé",
    price: 1800,
    categories: ["vases", "verre", "fume"],
    image: "/placeholder.svg?height=400&width=400",
    badge: "NOUVEAU",
  },
  // Miroirs
  {
    id: "19",
    name: "Miroir Rond Doré",
    price: 5200,
    categories: ["miroirs", "rond", "dore"],
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "20",
    name: "Miroir Rectangulaire Noir",
    price: 4800,
    categories: ["miroirs", "rectangulaire", "noir"],
    image: "/placeholder.svg?height=400&width=400",
    badge: "TOP VENTE",
  },
  // Bougies
  {
    id: "21",
    name: "Bougie Parfumée Vanille",
    price: 1200,
    categories: ["bougies", "parfumee", "vanille"],
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "22",
    name: "Bougie Décorative Dorée",
    price: 1500,
    categories: ["bougies", "decorative", "doree"],
    image: "/placeholder.svg?height=400&width=400",
    badge: "NOUVEAU",
  },
]

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

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const { toast } = useToast()
  const addToCart = useCartStore((state) => state.addItem)

  const [products, setProducts] = useState<typeof allProducts>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState("featured")
  const [gridView, setGridView] = useState<"grid3" | "grid4">("grid4")
  const [priceRange, setPriceRange] = useState<string>("all")

  // Filter products based on category and price range
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      let filteredProducts = allProducts.filter((product) => product.categories.includes(category))

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
            .filter((p) => p.badge === "NOUVEAU")
            .concat(filteredProducts.filter((p) => p.badge !== "NOUVEAU"))
          break
        case "bestsellers":
          filteredProducts = filteredProducts
            .filter((p) => p.badge === "TOP VENTE")
            .concat(filteredProducts.filter((p) => p.badge !== "TOP VENTE"))
          break
        // For "featured", we keep the original order
      }

      setProducts(filteredProducts)
      setIsLoading(false)
    }, 500)
  }, [category, sortBy, priceRange])

  const handleAddToCart = (product: (typeof allProducts)[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: "1M×50CM", // Default size
      frame: "SANS", // Default frame
      image: product.image,
    })

    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    })
  }

  const displayName =
    categoryDisplayNames[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")

  return (
    <div className="container mx-auto px-4 py-8">
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
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
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
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => handleAddToCart(product)}>
                    Ajouter
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

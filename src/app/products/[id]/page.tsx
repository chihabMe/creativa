"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useCartStore } from "@/lib/store"
import RelatedProducts from "@/components/related-products"

// Sample product data
const product = {
  id: "2",
  name: "Ambre urbaine - orange marron beige abstrait",
  price: 3800,
  categories: ["ABSTRAIT", "MINIMALISTE", "GRAND TABLEAUX"],
  image: "/placeholder.svg?height=600&width=600",
  gallery: [
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
  ],
}

const sizes = [
  { value: "1M×50CM", label: "1M×50CM" },
  { value: "1M×70 CM", label: "1M×70 CM" },
  { value: "1M20×60 CM", label: "1M20×60 CM" },
  { value: "1M20×80 CM", label: "1M20×80 CM" },
]

const frameOptions = [
  { value: "SANS", label: "TOILE (SANS ENCADREMENT )" },
  { value: "DORE", label: "TOILE + ENCADREMENT DORÉ" },
  { value: "NOIR", label: "TOILE + ENCADREMENT NOIR" },
  { value: "BOIS", label: "TOILE + ENCADREMENT BOIS" },
]

export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState(sizes[0].value)
  const [selectedFrame, setSelectedFrame] = useState(frameOptions[0].value)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(product.image)
  const { toast } = useToast()
  const addToCart = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      frame: selectedFrame,
      image: product.image,
    })

    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    })
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div
            className="relative aspect-square overflow-hidden rounded-lg border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          <div className="flex gap-2">
            {[product.image, ...product.gallery].map((img, index) => (
              <motion.div
                key={index}
                className={`relative h-20 w-20 cursor-pointer overflow-hidden rounded-md border ${
                  selectedImage === img ? "ring-2 ring-black" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(img)}
              >
                <Image src={img || "/placeholder.svg"} alt={`Thumbnail ${index}`} fill className="object-cover" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex gap-2">
              {product.categories.map((category) => (
                <Link
                  key={category}
                  href={`/category/${category.toLowerCase()}`}
                  className="text-sm text-gray-500 hover:text-black hover:underline"
                >
                  {category}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-2xl font-semibold">{product.price} DA</p>
          </motion.div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium">Tailles</h3>
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {sizes.map((size) => (
                  <div key={size.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={size.value} id={`size-${size.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`size-${size.value}`}
                      className="flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-200 px-3 py-2 text-center text-sm peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white"
                    >
                      {size.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h3 className="mb-2 font-medium">Couleurs</h3>
              <RadioGroup
                value={selectedFrame}
                onValueChange={setSelectedFrame}
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {frameOptions.map((frame) => (
                  <div key={frame.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={frame.value} id={`frame-${frame.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`frame-${frame.value}`}
                      className="flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-200 px-3 py-2 text-center text-sm peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white"
                    >
                      {frame.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h3 className="mb-2 font-medium">Quantité</h3>
              <div className="flex h-10 w-32 items-center">
                <Button variant="outline" size="icon" className="h-full rounded-r-none" onClick={decreaseQuantity}>
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex h-full flex-1 items-center justify-center border-y">{quantity}</div>
                <Button variant="outline" size="icon" className="h-full rounded-l-none" onClick={increaseQuantity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 sm:flex-row">
              <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                J'achète maintenant
              </Button>
              <Button variant="outline" className="w-full" size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Ajouter au panier
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts />
    </div>
  )
}

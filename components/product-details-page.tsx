"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/cart-context"
import ProductCard from "@/components/product-card"
import type { Product } from "@/lib/types"
// import Script from "next/script"
import Breadcrumb from "@/components/breadcrumb"
import WishlistButton from "@/components/wishlist-button"
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store"
import RecentlyViewedProducts from "@/components/recently-viewed-products"
import StockBadge from "@/components/stock-badge"
import SocialShare from "@/components/social-share"
import { getProductBySlug, getRelatedProducts } from "@/lib/data"

interface ProductDetailsPageProps {
  product: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>
  relatedProducts: Awaited<ReturnType<typeof getRelatedProducts>>
}

export default function ProductDetailsPage({ product, relatedProducts }: ProductDetailsPageProps) {
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0].size : "1M×50CM",
  )
  const [selectedFrame, setSelectedFrame] = useState(
    product.frames && product.frames.length > 0 ? product.frames[0].frame : "SANS",
  )
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState((product.images && product.images[0]) || "")
  const { toast } = useToast()
  const { addItem: addItemToCart, openCart } = useCart()
  const { addItem } = useRecentlyViewedStore()

  useEffect(() => {
    // Add the current product to recently viewed
    addItem(product.id)
  }, [product.id, addItem])

  // Calculate the final price based on selected size and frame
  const getSelectedSizePrice = () => {
    if (product.sizes && product.sizes.length > 0) {
      const size = product.sizes.find((s) => s.size === selectedSize)
      return size ? size.price : product.price
    }
    return product.price
  }

  const getSelectedFramePrice = () => {
    if (product.frames && product.frames.length > 0) {
      const frame = product.frames.find((f) => f.frame === selectedFrame)
      return frame ? frame.price : 0
    }
    return 0
  }

  const finalPrice = product.price + getSelectedSizePrice() + getSelectedFramePrice()

  const handleAddToCart = () => {
    addItemToCart({
      id: product.id.toString(),
      name: product.name,
      price: finalPrice,
      quantity,
      size: selectedSize,
      frame: selectedFrame,
      image: (product.images && product.images[0]) || "",
    })

    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    })
  }

  const handleBuyNow = () => {
    addItemToCart({
      id: product.id.toString(),
      name: product.name,
      price: finalPrice,
      quantity,
      size: selectedSize,
      frame: selectedFrame,
      image: (product.images && product.images[0]) || "",
    })

    openCart()
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const generateJsonLd = (product: Product) => {
    const jsonLd = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.name,
      image: product.images.map((img) => img),
      description: product.description || `${product.name} - Décoration d'intérieur par CRÉATIVA DÉCO`,
      brand: {
        "@type": "Brand",
        name: "CRÉATIVA DÉCO",
      },
      offers: {
        "@type": "Offer",
        url: `https://creativadeco.com/products/${product.id}`,
        priceCurrency: "DZD",
        price: product.price,
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    }

    return JSON.stringify(jsonLd)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: (product.categories?.[0] || "Produits"), href: `/category/${product.categories?.[0] || ""}` },
          { label: product.name, href: `/products/${product.id}` },
        ]}
      />
      {/* <Script
        id={`product-jsonld-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateJsonLd(product) }}
      /> */}
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
            {product.images?.map((img, index) => (
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
              {product.categories?.map((category) => (
                <Link
                  key={category}
                  href={`/category/${category.toLowerCase()}`}
                  className="text-sm text-gray-500 hover:text-black hover:underline"
                >
                  {category}
                </Link>
              ))}
            </div>
            <div className="mt-2 inline-block">

              <StockBadge stock={product.stock} />
            </div>
            <p className="mt-4 text-2xl font-semibold">{finalPrice} DA</p>
          </motion.div>

          <div className="space-y-4">
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="mb-2 font-medium">Tailles</h3>
                <RadioGroup
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  {product.sizes.map((size) => (
                    <div key={size.size} className="flex items-center space-x-2">
                      <RadioGroupItem value={size.size} id={`size-${size.size}`} className="peer sr-only" />
                      <Label
                        htmlFor={`size-${size.size}`}
                        className="flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-200 px-3 py-2 text-center text-sm peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white"
                      >
                        {size.size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {product.frames && product.frames.length > 0 && (
              <div>
              <h3 className="mb-2 font-medium">Encadrement</h3>
              <RadioGroup
                value={selectedFrame}
                onValueChange={setSelectedFrame}
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {product.frames.map((frame) => (
                <div key={frame.frame} className="flex items-center space-x-2">
                  <RadioGroupItem value={frame.frame} id={`frame-${frame.frame}`} className="peer sr-only" />
                  <Label
                  htmlFor={`frame-${frame.frame}`}
                  className="flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-200 px-3 py-2 text-center text-sm peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white"
                  >
                  {frame.frame}
                  </Label>
                </div>
                ))}
              </RadioGroup>
              </div>
            )}

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
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
              >
                {product.stock <= 0 ? "Rupture de stock" : "J'achète maintenant"}
              </Button>
              <div className="flex w-full gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.stock <= 0 ? "Indisponible" : "Ajouter au panier"}
                </Button>
                <WishlistButton
                  productId={product.id}
                  productName={product.name}
                  variant="outline"
                  className="h-12 w-12"
                />
              </div>
            </div>
          </div>

          {product.description && (
            <div className="pt-4">
              <h3 className="mb-2 font-medium">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          <div className="pt-4">
            <SocialShare
              url={`https://creativadeco.com/products/${product.id}`}
              title={product.name}
              description={product.description || undefined}
            />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
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
      )}
      <RecentlyViewedProducts currentProductId={product.id} />
    </div>
  )
}

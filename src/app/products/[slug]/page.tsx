import { getProductById, getProductBySlug, getRelatedProducts } from "@/lib/data"
import { notFound } from "next/navigation"
import ProductDetailsPage from "@/components/product-details-page"
import RecentlyViewedProducts from "@/components/recently-viewed-products"
import type { Metadata, ResolvingMetadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface ProductPageProps {
  params: {slug:string}
}

export async function generateMetadata({ params }: ProductPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const productSlug = params.slug

  const product = await getProductBySlug(productSlug)

  if (!product) {
    return {
      title: "Produit non trouvé | CRÉATIVA DÉCO",
    }
  }

  // Get the first category for breadcrumbs
  const firstCategory = product.categories && product.categories.length > 0 ? product.categories[0] : ""

  // Format price
  const formattedPrice = `${product.price.toLocaleString()} DA`

  return {
    title: `${product.name} | CRÉATIVA DÉCO`,
    description:
      product.description || `Découvrez ${product.name} - ${formattedPrice} - Livraison dans toute l'Algérie.`,
    keywords: [
      ...(product.categories ?? []),
      "décoration",
      "tableaux",
      "intérieur",
      "art mural",
      "Algérie",
      "CRÉATIVA DÉCO",
    ].join(", "),
    openGraph: {
      title: product.name,
      description:
        product.description || `Découvrez ${product.name} - ${formattedPrice} - Livraison dans toute l'Algérie.`,
      url: `https://creativadeco.com/products/${product.slug}`,
      siteName: "CRÉATIVA DÉCO",
      images: [
        {
          url: (product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"),
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      locale: "fr_FR",
      // Removed product-specific OpenGraph metadata as it is not valid
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description:
        product.description || `Découvrez ${product.name} - ${formattedPrice} - Livraison dans toute l'Algérie.`,
      images: [(product.images?.[0] ?? "/placeholder.svg")],
    },
    alternates: {
      canonical: `https://creativadeco.com/products/${product.slug}`,
    },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const productSlug =  params.slug

  const product = await getProductBySlug(productSlug)

  if (!product) {
    notFound()
  }

  if (!product) {
    notFound()
  }

  // Get the first category to find related products
  const firstCategory = product.categories && product.categories.length > 0 ? product.categories[0] : ""
  const relatedProducts = await getRelatedProducts(product.id, firstCategory, 4)

  return (
    <>
    <Header/>
    <main className="container mx-auto px-4 py-8">
      <ProductDetailsPage product={product} relatedProducts={relatedProducts} />
      <div className="mt-16">
        <RecentlyViewedProducts currentProductId={product.id} />
      </div>
    </main>
    <Footer/>
    </>
  )
}

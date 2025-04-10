import { getProductsByCategory } from "@/lib/data"
import CategoryPage from "@/components/category-page"
import type { Metadata, ResolvingMetadata } from "next"

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

interface CategoryPageProps {
  params: { category: string }
}

export async function generateMetadata({ params }: CategoryPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const category = params.category

  // Get display name for the category
  const displayName =
    categoryDisplayNames[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")

  return {
    title: `${displayName} | CRÉATIVA DÉCO`,
    description: `Découvrez notre collection de ${displayName.toLowerCase()} - Livraison dans toute l'Algérie.`,
    keywords: `${category}, décoration, tableaux, intérieur, art mural, Algérie, CRÉATIVA DÉCO`,
    openGraph: {
      title: `${displayName} | CRÉATIVA DÉCO`,
      description: `Découvrez notre collection de ${displayName.toLowerCase()} - Livraison dans toute l'Algérie.`,
      url: `https://creativadeco.com/category/${category}`,
      siteName: "CRÉATIVA DÉCO",
      images: [
        {
          url: "/images/banner-1.jpg",
          width: 1200,
          height: 630,
          alt: `Collection ${displayName} - CRÉATIVA DÉCO`,
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} | CRÉATIVA DÉCO`,
      description: `Découvrez notre collection de ${displayName.toLowerCase()} - Livraison dans toute l'Algérie.`,
      images: ["/images/banner-1.jpg"],
    },
    alternates: {
      canonical: `https://creativadeco.com/category/${category}`,
    },
  }
}

export default async function CategoryRoute({ params }: CategoryPageProps) {
  const category = params.category
  const products = await getProductsByCategory(category)

  return <CategoryPage category={category} initialProducts={products} />
}

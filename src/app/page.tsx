import type { Metadata, ResolvingMetadata } from "next";
import Hero from "@/components/hero";
import Footer from "@/components/footer";
import ProductGrid from "@/components/product-grid";
import Features from "@/components/features";
import Header from "@/components/header";
import {
  getFeaturedCategoriesFromDB,
  getFeaturedProducts,
  getProductsByCategory,
} from "@/lib/data";
import HomeJsonLd from "./home-jsonld";

export async function generateMetadata(): Promise<Metadata> {
  // Get the parent metadata (if any)

  // Define the metadata for the home page
  return {
    title: "CRÉATIVA DÉCO - Tableaux & Decoration d'Intérieur",
    description:
      "Sublimez votre intérieur avec nos magnifiques tableaux et décorations. Livraison dans toute l'Algérie.",
    keywords:
      "décoration, tableaux, intérieur, art mural, Algérie, CRÉATIVA DÉCO",
    openGraph: {
      title: "CRÉATIVA DÉCO - Tableaux & Decoration d'Intérieur",
      description:
        "Sublimez votre intérieur avec nos magnifiques tableaux et décorations. Livraison dans toute l'Algérie.",
      url: "https://creativadeco.com",
      siteName: "CRÉATIVA DÉCO",
      images: [
        {
          url: "/images/banner-1.jpg",
          width: 1200,
          height: 630,
          alt: "CRÉATIVA DÉCO - Tableaux & Decoration",
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "CRÉATIVA DÉCO - Tableaux & Decoration d'Intérieur",
      description:
        "Sublimez votre intérieur avec nos magnifiques tableaux et décorations. Livraison dans toute l'Algérie.",
      images: ["/images/banner-1.jpg"],
    },
    alternates: {
      canonical: "https://creativadeco.com",
    },
  };
}

export default async function Home() {
  // Fetch featured products from the database
  const featuredProducts = await getFeaturedProducts(16);
  const featuredCategories = await getFeaturedCategoriesFromDB();
  const productsForEachCategory = await Promise.all(
    featuredCategories.map(async (category) => {
      const products = await getProductsByCategory(category.slug, 4);
      return {
        ...category,
        products,
      };
    })
  );

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col">
        <Hero />
        <ProductGrid products={featuredProducts} title="Nouveauté" />
        {productsForEachCategory.map((item) => (
          item.products.length > 0 && (
            <ProductGrid products={item.products} title={item.name} />
          )
        ))}
        <Features />
        <HomeJsonLd />
      </main>

      <Footer />
    </>
  );
}

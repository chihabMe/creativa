import type { Metadata } from "next"
import Hero from "@/components/hero"
import ProductGrid from "@/components/product-grid"
import Features from "@/components/features"

export const metadata: Metadata = {
  title: "CRÉATIVA DÉCO - Tableaux & Decoration",
  description: "Sublimez votre intérieur avec nos magnifiques tableaux",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <ProductGrid />
      <Features />
    </main>
  )
}

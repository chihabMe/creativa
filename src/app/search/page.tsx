import { searchProducts } from "@/lib/data";
import ProductGrid from "@/components/product-grid";
import type { Metadata } from "next";
import SearchForm from "@/components/search-form";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Recherche | CRÉATIVA DÉCO",
  description:
    "Recherchez parmi notre collection de tableaux et décorations d'intérieur",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const products = query ? await searchProducts(query) : [];

  return (
    <>
      <Header />
      <main className="container min-h-screen mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Recherche</h1>

        <div className="mb-8">
          <SearchForm initialQuery={query} />
        </div>

        {query ? (
          <>
            <p className="mb-8 text-gray-600">
              {products.length} résultat{products.length !== 1 ? "s" : ""} pour
              "{query}"
            </p>

            {products.length > 0 ? (
              <ProductGrid
                products={products}
                title={`Résultats pour "${query}"`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <h2 className="mb-2 text-xl font-semibold">
                  Aucun produit trouvé
                </h2>
                <p className="text-center text-gray-600">
                  Nous n'avons pas trouvé de produits correspondant à votre
                  recherche.
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600">
            Veuillez saisir un terme de recherche
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}

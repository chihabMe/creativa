import type { Metadata } from "next";
import WishlistClient from "./wishlist-client";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Mes Favoris | CRÉATIVA DÉCO",
  description: "Consultez vos produits favoris chez CRÉATIVA DÉCO",
};

export default function WishlistPage() {
  return (
    <>
      <Header />
      <main className="container min-h-screen mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Mes Favoris</h1>
        <WishlistClient />
      </main>
      <Footer />
    </>
  );
}

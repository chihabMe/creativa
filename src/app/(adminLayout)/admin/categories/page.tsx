import { getCategories } from "@/lib/actions/ category-actions"
import CategoriesList from "./_components/categories-list"

export const metadata = {
  title: "Gestion des catégories | Admin",
  description: "Gérez les catégories de votre boutique",
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <main>
      <CategoriesList categories={categories} />
    </main>
  )
}


import { getCategories } from "@/lib/actions/ category-actions"
import NewProductForm from "../_components/new-product-form"

export default async function NewProductPage() {
  // Fetch categories from the database
  const categories = await getCategories()

  return <NewProductForm categories={categories} />
}

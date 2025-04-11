
import Link from "next/link"
import { Plus} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProducts, deleteProduct } from "@/lib/actions/product-actions"
import AdminProductsList from "./_components/admin-products-list"

export default async function ProductsPage() {
  const products = await getProducts()


  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Produits</h2>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Link>
        </Button>
      </div>
      <AdminProductsList products={products}/>

    </div>
  )
}

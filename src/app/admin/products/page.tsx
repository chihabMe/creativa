import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAdminProducts } from "@/lib/actions/product-actions"
import AdminProductsList from "./_components/admin-products-list"
import { Paginator } from "@/components/paginator"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string }
}) {
  const page = Number(searchParams.page) || 1
  const pageSize = Number(searchParams.pageSize) || 10

  const { products, totalPages, currentPage } = await getAdminProducts({
    page,
    pageSize,
  })

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Produits</h2>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href="/admin/categories">Gérer les catégories</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un produit
            </Link>
          </Button>
        </div>
      </div>
      <AdminProductsList products={products} />

      {/* Pagination component */}
      <div className="flex justify-center mt-6">
        <Paginator totalPages={totalPages} currentPage={currentPage} baseUrl="/admin/products" />
      </div>
    </div>
  )
}

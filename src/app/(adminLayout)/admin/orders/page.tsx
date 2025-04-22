import { getOrders } from "@/lib/actions/order-actions"
import OrdersList from "./_components/orders-list"
import { Pagination } from "@/components/ui/pagination"
import { Paginator } from "@/components/paginator";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { query?: string; status?: string; page?: string; pageSize?: string }
}) {
  const query = searchParams.query || ""
  const status = searchParams.status || "all"
  const page = Number(searchParams.page) || 1
  const pageSize = Number(searchParams.pageSize) || 6

  // Get paginated orders
  const { orders: allOrders, totalPages, currentPage } = await getOrders({
    page,
    pageSize,
  })

  // Filter orders based on search query and status
  const filteredOrders = allOrders.filter((order) => {
    const matchesQuery =
      !query ||
      order.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
      order.customerName.toLowerCase().includes(query.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = status === "all" || order.status === status
    return matchesQuery && matchesStatus
  })

  return (
    <main>
      <OrdersList filteredOrders={filteredOrders} />
      
      {/* Pagination component */}
      <div className="flex justify-center mt-6">
        <Paginator
          totalPages={totalPages}
          currentPage={currentPage}
          baseUrl={`/admin/orders?status=${status}&query=${query}`}
        />
      </div>
    </main>
  )
}
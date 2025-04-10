import { getOrders  } from "@/lib/actions/order-actions"
import OrdersList from "./_components/orders-list"

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { query?: string; status?: string }
}) {
  const query = searchParams.query || ""
  const status = searchParams.status || "all"

  const allOrders = await getOrders()

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
    </main>
  )
}

import { notFound } from "next/navigation"
import { getOrderById } from "@/lib/actions/order-actions"
import OrderDetails from "../_components/order-details"

export default async function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  const orderId = params.id

  if (!orderId) {
    notFound()
  }

  const order = await getOrderById(orderId)

  if (!order) {
    notFound()
  }

  return (
    <main>
      <OrderDetails order={order} />
    </main>
  )
}

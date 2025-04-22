import { notFound } from "next/navigation"
import { getOrderById } from "@/lib/actions/order-actions"
import OrderInvoice from "../../_components/order-invoice"

export default async function AdminOrderInvoicePage({ params }: { params: { id: string } }) {
  const orderId = params.id

  if (!orderId) {
    notFound()
  }

  const order = await getOrderById(orderId)

  if (!order) {
    notFound()
  }

  return <OrderInvoice order={order} />
}

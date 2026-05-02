import { getOrderByNumber } from "@/lib/actions/order-actions"
import { notFound } from "next/navigation"
import OrderDetails from "@/components/order-details"

export default async function OrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber: rawOrderNumber } = await params
  const orderNumber = decodeURIComponent(rawOrderNumber).trim().toUpperCase()

  const order = await getOrderByNumber(orderNumber)

  if (!order) {
    notFound()
  }

  return <OrderDetails order={order} />
}

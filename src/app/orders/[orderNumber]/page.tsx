import { getOrderByNumber } from "@/lib/actions/order-actions"
import { notFound } from "next/navigation"
import OrderDetails from "@/components/order-details"

export default async function OrderPage({ params }: { params: { orderNumber: string } }) {
  const orderNumber = params.orderNumber

  const order = await getOrderByNumber(orderNumber)

  if (!order) {
    notFound()
  }

  return <OrderDetails order={order} />
}

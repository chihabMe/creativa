"use client"

import { useEffect } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { getOrderById } from "@/lib/actions/order-actions"

interface Props {
order: NonNullable<Awaited<ReturnType<typeof getOrderById>>>
}

export default function OrderInvoice({ order }: Props) {
  useEffect(() => {
    // Auto-print when component mounts
    const timer = setTimeout(() => {
      window.print()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP", { locale: fr })
  }

  const calculateSubtotal = () => {
    return order.orderItems.reduce((total: number, item: any) => {
      return total + item.price * item.quantity
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const shipping = 1000 // Assuming fixed shipping cost of 1000 DA

  return (
    <div className="bg-white p-8 print:p-4">
      <div className="mb-8 flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold">Facture #{order.orderNumber}</h1>
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimer
        </Button>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FACTURE</h1>
          <p className="text-muted-foreground">#{order.orderNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">CREATIVA DECO</h2>
          <p className="text-sm text-muted-foreground">
            123 Rue des Arts
            <br />
            Alger, 16000
            <br />
            Algérie
            <br />
            contact@creativadeco.com
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-8">
        <div>
          <h3 className="mb-2 font-semibold">Facturé à:</h3>
          <p>
            {order.customerName}
            <br />
            {order.customerEmail}
            <br />
            {order.customerPhone}
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Adresse de livraison:</h3>
          <p>
            {order.shippingAddress ? (
              <>
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}
                <br />
                {order.shippingAddress.postalCode || ""}
              </>
            ) : (
              "Adresse non disponible"
            )}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-2 flex justify-between">
          <h3 className="font-semibold">Date de commande:</h3>
          <p>{formatDate(order.createdAt.toString())}</p>
        </div>
        <div className="mb-2 flex justify-between">
          <h3 className="font-semibold">Méthode de paiement:</h3>
          <p>{order.paymentMethod === "cash" ? "Paiement à la livraison" : order.paymentMethod}</p>
        </div>
        <div className="flex justify-between">
          <h3 className="font-semibold">Statut:</h3>
          <p>
            {order.status === "pending"
              ? "En attente"
              : order.status === "processing"
                ? "En cours"
                : order.status === "shipped"
                  ? "Expédié"
                  : order.status === "delivered"
                    ? "Livré"
                    : "Annulé"}
          </p>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2">Produit</th>
            <th className="pb-2">Prix unitaire</th>
            <th className="pb-2">Quantité</th>
            <th className="pb-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item: any) => (
            <tr key={item.id} className="border-b">
              <td className="py-4">
                <div className="flex items-start gap-2">
                  <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                    {item.product?.images?.[0] ? (
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.product?.name || "Produit non disponible"}</p>
                    <p className="text-xs text-muted-foreground">
                      Taille: {item.size || "Standard"}, Cadre: {item.frame || "Standard"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-4">{item.price.toLocaleString()} DA</td>
              <td className="py-4">{item.quantity}</td>
              <td className="py-4 text-right">{(item.price * item.quantity).toLocaleString()} DA</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 flex justify-end">
        <div className="w-80">
          <div className="flex justify-between border-b py-2">
            <span>Sous-total</span>
            <span>{subtotal.toLocaleString()} DA</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span>Livraison</span>
            <span>{shipping.toLocaleString()} DA</span>
          </div>
          <div className="flex justify-between py-2 font-bold">
            <span>Total</span>
            <span>{order.total.toLocaleString()} DA</span>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
        <p>Merci pour votre commande!</p>
        <p>Pour toute question, veuillez nous contacter à contact@creativadeco.com</p>
        <p className="mt-4">CREATIVA DECO - RC: 123456789 - NIF: 987654321</p>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Printer,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { updateOrderStatus, deleteOrder, type getOrderById } from "@/lib/actions/order-actions"

interface Props {
order: NonNullable<Awaited<ReturnType<typeof getOrderById>>>
}

export default function OrderDetails({ order }: Props) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const result = await updateOrderStatus({
        id: order.id,
        status: newStatus as "pending" | "processing" | "shipped" | "delivered" | "cancelled",
      })

      if (result?.data?.success) {
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la commande a été mis à jour avec succès.",
        })
        router.refresh()
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result?.data?.message || "Une erreur est survenue lors de la mise à jour du statut.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteOrder = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteOrder({ id: order.id })

      if (result?.data?.success) {
        toast({
          title: "Commande supprimée",
          description: "La commande a été supprimée avec succès.",
        })
        router.push("/admin/orders")
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result?.data?.message || "Une erreur est survenue lors de la suppression de la commande.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la commande.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-emerald-500">Livré</Badge>
      case "processing":
        return <Badge className="bg-blue-500">En cours</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">En attente</Badge>
      case "shipped":
        return <Badge className="bg-purple-500">Expédié</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Annulé</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP à HH:mm", { locale: fr })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const calculateSubtotal = () => {
    return order.orderItems.reduce((total: number, item: any) => {
      return total + item.price * item.quantity
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const shipping = 1000 // Assuming fixed shipping cost of 1000 DA

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Commande #{order.orderNumber}</h1>
          {getStatusBadge(order.status)}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/orders/${order.id}/invoice`}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cela supprimera définitivement la commande #{order.orderNumber}{" "}
                  et toutes les données associées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteOrder}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Détails de la commande</CardTitle>
            <CardDescription>Créée le {formatDate(order.createdAt.toString())}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Statut</span>
              <div className="flex items-center gap-2">
                <Select defaultValue={order.status} onValueChange={handleStatusChange} disabled={isUpdating}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="processing">En cours</SelectItem>
                    <SelectItem value="shipped">Expédié</SelectItem>
                    <SelectItem value="delivered">Livré</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Méthode de paiement</span>
              <span className="text-sm">
                {order.paymentMethod === "cash" ? "Paiement à la livraison" : order.paymentMethod}
              </span>
            </div>

            {order.notes && (
              <div className="space-y-1">
                <span className="text-sm font-medium">Notes</span>
                <p className="rounded-md bg-muted p-3 text-sm">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-medium">{order.customerName}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${order.customerEmail}`} className="hover:underline">
                  {order.customerEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href={`tel:${order.customerPhone}`} className="hover:underline">
                  {order.customerPhone}
                </a>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-medium">Adresse de livraison</h3>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <div>
                  {order.shippingAddress && (
                    <>
                      <p>{order.shippingAddress.address}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                      {order.shippingAddress.postalCode && <p>{order.shippingAddress.postalCode}</p>}
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Produits commandés</CardTitle>
          <CardDescription>{order.orderItems.length} article(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.orderItems.map((item: any) => (
              <div key={item.id} className="flex items-start gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                  {item.product?.images?.[0] ? (
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <h4 className="font-medium">
                    <Link href={`/admin/products/edit/${item.productId}`} className="hover:underline">
                      {item.product?.name || "Produit non disponible"}
                    </Link>
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    <p>Taille: {item.size || "Standard"}</p>
                    <p>Cadre: {item.frame || "Standard"}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium">{item.price.toLocaleString()} DA</div>
                  <div className="text-sm text-muted-foreground">Qté: {item.quantity}</div>
                  <div className="font-medium">{(item.price * item.quantity).toLocaleString()} DA</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex flex-col items-end p-6">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sous-total</span>
              <span>{subtotal.toLocaleString()} DA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Livraison</span>
              <span>{shipping.toLocaleString()} DA</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{order.total.toLocaleString()} DA</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique de la commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {getStatusIcon(order.status)}
              <div>
                <p className="font-medium">
                  Commande{" "}
                  {order.status === "pending"
                    ? "reçue"
                    : order.status === "processing"
                      ? "en cours de traitement"
                      : order.status === "shipped"
                        ? "expédiée"
                        : order.status === "delivered"
                          ? "livrée"
                          : "annulée"}
                </p>
                <p className="text-sm text-muted-foreground">{formatDate(order.updatedAt.toString())}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">Commande reçue</p>
                <p className="text-sm text-muted-foreground">{formatDate(order.createdAt.toString())}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

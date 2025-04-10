"use client"

import Link from "next/link"
import { Eye, FileText, Truck, CheckCircle, XCircle, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getOrders, updateOrderStatus } from "@/lib/actions/order-actions"
import { OrderSearch } from "@/components/admin/order-search"
import { OrderStatusFilter } from "@/components/admin/order-status-filter"
import { revalidatePath } from "next/cache"

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

  const handleUpdateStatus = async (
    id: number,
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  ) => {
    "use server"
    await updateOrderStatus({ id, status })
    revalidatePath("/admin/orders")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-500">Livré</Badge>
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
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Commandes</h2>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid flex-1 gap-2">
            <CardTitle>Gestion des commandes</CardTitle>
            <CardDescription>Vous avez {filteredOrders.length} commandes au total.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <OrderSearch />
              <OrderStatusFilter />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commande</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Aucune commande trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{formatDate(order.createdAt.toString())}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.total.toLocaleString()} DA</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/orders/${order.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir les détails
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/orders/${order.id}/invoice`}>
                                <FileText className="mr-2 h-4 w-4" />
                                Facture
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, "processing")}
                              disabled={order.status === "processing"}
                            >
                              <Truck className="mr-2 h-4 w-4" />
                              Marquer comme en cours
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, "shipped")}
                              disabled={order.status === "shipped"}
                            >
                              <Truck className="mr-2 h-4 w-4" />
                              Marquer comme expédié
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, "delivered")}
                              disabled={order.status === "delivered"}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Marquer comme livré
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleUpdateStatus(order.id, "cancelled")}
                              disabled={order.status === "cancelled"}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Annuler la commande
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

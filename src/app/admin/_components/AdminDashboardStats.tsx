import { getDashboardStats, getRecentOrders, getLowStockProducts } from '@/lib/data'
import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Props {
  stats: Awaited<ReturnType<typeof getDashboardStats>>
  recentOrders: Awaited<ReturnType<typeof getRecentOrders>>
  lowStockProducts: Awaited<ReturnType<typeof getLowStockProducts>>
}

const AdminDashboardStats = ({ stats, recentOrders, lowStockProducts }: Props) => {
  // Helper to format status display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending": return "En attente"
      case "processing": return "En cours"
      case "shipped": return "Expédié"
      case "delivered": return "Livré"
      case "cancelled": return "Annulé"
      default: return status
    }
  }

  // Helper to get status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "processing": return "bg-blue-100 text-blue-800"
      case "shipped": return "bg-purple-100 text-purple-800"
      case "delivered": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Sales */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventes totales</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {`${stats.totalSales.toLocaleString()} DA`}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className={`font-medium flex items-center ${stats.salesGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {stats.salesGrowth >= 0 ? "+" : ""}{stats.salesGrowth.toFixed(1)}%
                    {stats.salesGrowth >= 0 ? 
                      <ArrowUpRight className="h-3 w-3 ml-1" /> : 
                      <ArrowDownRight className="h-3 w-3 ml-1" />
                    }
                  </span>{" "}
                  par rapport au mois dernier
                </p>
              </CardContent>
            </Card>

            {/* Total Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`font-medium flex items-center ${stats.ordersGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {stats.ordersGrowth >= 0 ? "+" : ""}{stats.ordersGrowth.toFixed(1)}%
                    {stats.ordersGrowth >= 0 ? 
                      <ArrowUpRight className="h-3 w-3 ml-1" /> : 
                      <ArrowDownRight className="h-3 w-3 ml-1" />
                    }
                  </span>{" "}
                  par rapport au mois dernier
                </p>
              </CardContent>
            </Card>

            {/* Total Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produits</CardTitle>
                <Package className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`font-medium flex items-center ${stats.productsGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {stats.productsGrowth >= 0 ? "+" : ""}{stats.productsGrowth.toFixed(1)}%
                    {stats.productsGrowth >= 0 ? 
                      <ArrowUpRight className="h-3 w-3 ml-1" /> : 
                      <ArrowDownRight className="h-3 w-3 ml-1" />
                    }
                  </span>{" "}
                  nouveaux produits ce mois
                </p>
              </CardContent>
            </Card>

            {/* Total Customers */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`font-medium flex items-center ${stats.customersGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {stats.customersGrowth >= 0 ? "+" : ""}{stats.customersGrowth.toFixed(1)}%
                    {stats.customersGrowth >= 0 ? 
                      <ArrowUpRight className="h-3 w-3 ml-1" /> : 
                      <ArrowDownRight className="h-3 w-3 ml-1" />
                    }
                  </span>{" "}
                  par rapport au mois dernier
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Orders */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
                <CardDescription>
                  Vous avez {recentOrders?.length} commandes récentes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm font-medium text-gray-500">
                        <th className="pb-2">N° Commande</th>
                        <th className="pb-2">Client</th>
                        <th className="pb-2">Total</th>
                        <th className="pb-2">Statut</th>
                        <th className="pb-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b text-sm last:border-0">
                          <td className="py-3">{order.orderNumber}</td>
                          <td className="py-3">{order.customerName || order.user?.name || order.user?.email}</td>
                          <td className="py-3">{order.total.toLocaleString()} DA</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(order.status)}`}>
                              {getStatusDisplay(order.status)}
                            </span>
                          </td>
                          <td className="py-3">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Products */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Produits en stock faible</CardTitle>
                <CardDescription>
                  {lowStockProducts.length} produits nécessitent votre attention.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm font-medium text-gray-500">
                        <th className="pb-2">Produit</th>
                        <th className="pb-2">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.map((product) => (
                        <tr key={product.id} className="border-b text-sm last:border-0">
                          <td className="py-3">{product.name}</td>
                          <td className="py-3">
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              {product.stock} restants
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboardStats
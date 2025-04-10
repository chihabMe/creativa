"use client"

import { useState, useEffect } from "react"
import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<{
    totalSales: number
    totalOrders: number
    totalProducts: number
    totalCustomers: number
    recentOrders: { id: string; customer: string; total: number; status: string; date: string }[]
    lowStockProducts: { id: string; name: string; stock: number; threshold: number }[]
  }>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    lowStockProducts: [],
  })

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        totalSales: 125000,
        totalOrders: 42,
        totalProducts: 68,
        totalCustomers: 35,
        recentOrders: [
          { id: "ORD-001", customer: "Ahmed Benali", total: 7800, status: "Livré", date: "2023-06-15" },
          { id: "ORD-002", customer: "Lina Mansouri", total: 4500, status: "En cours", date: "2023-06-14" },
          { id: "ORD-003", customer: "Karim Hadj", total: 12000, status: "En attente", date: "2023-06-13" },
          { id: "ORD-004", customer: "Amina Berrada", total: 3200, status: "Livré", date: "2023-06-12" },
          { id: "ORD-005", customer: "Youcef Kaci", total: 8900, status: "En cours", date: "2023-06-11" },
        ],
        lowStockProducts: [
          { id: "PRD-001", name: "Tableau Islamique Gold", stock: 2, threshold: 5 },
          { id: "PRD-002", name: "Vase Céramique Blanc", stock: 3, threshold: 5 },
          { id: "PRD-003", name: "Miroir Rond Doré", stock: 1, threshold: 3 },
        ],
      })
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventes totales</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : `${stats.totalSales.toLocaleString()} DA`}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium flex items-center">
                    +12.5% <ArrowUpRight className="h-3 w-3 ml-1" />
                  </span>{" "}
                  par rapport au mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium flex items-center">
                    +8.2% <ArrowUpRight className="h-3 w-3 ml-1" />
                  </span>{" "}
                  par rapport au mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produits</CardTitle>
                <Package className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium flex items-center">
                    +3.1% <ArrowUpRight className="h-3 w-3 ml-1" />
                  </span>{" "}
                  nouveaux produits ce mois
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500 font-medium flex items-center">
                    -2.5% <ArrowDownRight className="h-3 w-3 ml-1" />
                  </span>{" "}
                  par rapport au mois dernier
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
                <CardDescription>
                  Vous avez {isLoading ? "..." : stats.recentOrders.length} commandes récentes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">Chargement...</div>
                ) : (
                  <div className="space-y-8">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left text-sm font-medium text-gray-500">
                            <th className="pb-2">ID</th>
                            <th className="pb-2">Client</th>
                            <th className="pb-2">Total</th>
                            <th className="pb-2">Statut</th>
                            <th className="pb-2">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentOrders.map((order: any) => (
                            <tr key={order.id} className="border-b text-sm last:border-0">
                              <td className="py-3">{order.id}</td>
                              <td className="py-3">{order.customer}</td>
                              <td className="py-3">{order.total.toLocaleString()} DA</td>
                              <td className="py-3">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    order.status === "Livré"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "En cours"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3">{new Date(order.date).toLocaleDateString("fr-FR")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Produits en stock faible</CardTitle>
                <CardDescription>
                  {isLoading ? "..." : stats.lowStockProducts.length} produits nécessitent votre attention.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">Chargement...</div>
                ) : (
                  <div className="space-y-8">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left text-sm font-medium text-gray-500">
                            <th className="pb-2">Produit</th>
                            <th className="pb-2">Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.lowStockProducts.map((product: any) => (
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
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytiques</CardTitle>
              <CardDescription>Visualisez les performances de votre boutique.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Les graphiques analytiques seront disponibles prochainement.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

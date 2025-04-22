import { getDashboardStats, getLowStockProducts, getRecentOrders } from "@/lib/data";
import AdminDashboardStats from "./_components/AdminDashboardStats";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const orders = await getRecentOrders()
  const lowStockProducts = await getLowStockProducts()

  return (
    <main>
      <AdminDashboardStats lowStockProducts={lowStockProducts} recentOrders={orders} stats={stats} />
    </main>
  );
}
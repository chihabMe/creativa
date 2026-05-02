import { getDashboardStats, getRecentOrders } from "@/lib/data";
import AdminDashboardStats from "./_components/AdminDashboardStats";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const orders = await getRecentOrders()

  return (
    <main>
      <AdminDashboardStats recentOrders={orders} stats={stats} />
    </main>
  );
}

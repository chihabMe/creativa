import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminSettings } from "@/lib/actions/settings-actions";
import SettingsClient from "./_components/settings-client";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const initial = await getAdminSettings(session.user.id);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
      <SettingsClient initial={initial} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  updateAdminPassword,
  updateAdminPreferences,
  updateAdminProfile,
  updateSiteSettings,
} from "@/lib/actions/settings-actions";

interface SettingsClientProps {
  initial: {
    user: { name: string | null; email: string; passwordChangedAt: string | null } | null;
    preferences: {
      notificationsEnabled: boolean;
      orderAutoRefresh: boolean;
      ordersPageSize: number;
      productsPageSize: number;
    };
    site: {
      supportEmail: string;
      phone: string | null;
      whatsapp: string | null;
      address: string | null;
    };
  };
}

export default function SettingsClient({ initial }: SettingsClientProps) {
  const { toast } = useToast();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [savingSite, setSavingSite] = useState(false);

  const [profile, setProfile] = useState({
    name: initial.user?.name ?? "",
    email: initial.user?.email ?? "",
  });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [preferences, setPreferences] = useState({
    notificationsEnabled: initial.preferences.notificationsEnabled,
    orderAutoRefresh: initial.preferences.orderAutoRefresh,
    ordersPageSize: String(initial.preferences.ordersPageSize),
    productsPageSize: String(initial.preferences.productsPageSize),
  });
  const [site, setSite] = useState({
    supportEmail: initial.site.supportEmail ?? "",
    phone: initial.site.phone ?? "",
    whatsapp: initial.site.whatsapp ?? "",
    address: initial.site.address ?? "",
  });

  const showResult = (result: any, fallback: string) => {
    const failed = !result?.data?.success;
    toast({
      title: failed ? "Erreur" : "Succès",
      description:
        result?.data?.message ??
        (failed ? fallback : "Mise à jour effectuée."),
      variant: failed ? "destructive" : "default",
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profil admin</CardTitle>
          <CardDescription>Modifier le nom et l&apos;email du compte admin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="admin-name">Nom</Label>
            <Input
              id="admin-name"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <Button
            disabled={savingProfile}
            onClick={async () => {
              setSavingProfile(true);
              const result = await updateAdminProfile(profile);
              showResult(result, "Impossible de mettre à jour le profil.");
              setSavingProfile(false);
            }}
          >
            {savingProfile ? "Enregistrement..." : "Enregistrer le profil"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>Changer le mot de passe admin (ancien mot de passe requis).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="current-password">Mot de passe actuel</Label>
            <Input
              id="current-password"
              type="password"
              value={password.currentPassword}
              onChange={(e) => setPassword((p) => ({ ...p, currentPassword: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input
              id="new-password"
              type="password"
              value={password.newPassword}
              onChange={(e) => setPassword((p) => ({ ...p, newPassword: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
            <Input
              id="confirm-password"
              type="password"
              value={password.confirmPassword}
              onChange={(e) => setPassword((p) => ({ ...p, confirmPassword: e.target.value }))}
            />
          </div>
          <Button
            disabled={savingPassword}
            onClick={async () => {
              setSavingPassword(true);
              const result = await updateAdminPassword(password);
              showResult(result, "Impossible de changer le mot de passe.");
              if (result?.data?.success) {
                setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
              }
              setSavingPassword(false);
            }}
          >
            {savingPassword ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Préférences admin</CardTitle>
          <CardDescription>Réglages personnels du tableau de bord.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label htmlFor="notifications-enabled">Notifications activées</Label>
            <Switch
              id="notifications-enabled"
              checked={preferences.notificationsEnabled}
              onCheckedChange={(checked) =>
                setPreferences((p) => ({ ...p, notificationsEnabled: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label htmlFor="orders-auto-refresh">Auto-refresh commandes</Label>
            <Switch
              id="orders-auto-refresh"
              checked={preferences.orderAutoRefresh}
              onCheckedChange={(checked) =>
                setPreferences((p) => ({ ...p, orderAutoRefresh: checked }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="orders-page-size">Taille page commandes</Label>
              <Input
                id="orders-page-size"
                type="number"
                min={5}
                max={100}
                value={preferences.ordersPageSize}
                onChange={(e) =>
                  setPreferences((p) => ({ ...p, ordersPageSize: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="products-page-size">Taille page produits</Label>
              <Input
                id="products-page-size"
                type="number"
                min={5}
                max={100}
                value={preferences.productsPageSize}
                onChange={(e) =>
                  setPreferences((p) => ({ ...p, productsPageSize: e.target.value }))
                }
              />
            </div>
          </div>
          <Button
            disabled={savingPreferences}
            onClick={async () => {
              setSavingPreferences(true);
              const result = await updateAdminPreferences({
                notificationsEnabled: preferences.notificationsEnabled,
                orderAutoRefresh: preferences.orderAutoRefresh,
                ordersPageSize: Number(preferences.ordersPageSize),
                productsPageSize: Number(preferences.productsPageSize),
              });
              showResult(result, "Impossible de sauvegarder les préférences.");
              setSavingPreferences(false);
            }}
          >
            {savingPreferences ? "Enregistrement..." : "Enregistrer les préférences"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres du site</CardTitle>
          <CardDescription>Informations globales utilisées côté client.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="support-email">Email support</Label>
            <Input
              id="support-email"
              type="email"
              value={site.supportEmail}
              onChange={(e) => setSite((s) => ({ ...s, supportEmail: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-phone">Téléphone</Label>
            <Input
              id="support-phone"
              value={site.phone}
              onChange={(e) => setSite((s) => ({ ...s, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-whatsapp">WhatsApp</Label>
            <Input
              id="support-whatsapp"
              value={site.whatsapp}
              onChange={(e) => setSite((s) => ({ ...s, whatsapp: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-address">Adresse</Label>
            <Input
              id="support-address"
              value={site.address}
              onChange={(e) => setSite((s) => ({ ...s, address: e.target.value }))}
            />
          </div>
          <Button
            disabled={savingSite}
            onClick={async () => {
              setSavingSite(true);
              const result = await updateSiteSettings(site);
              showResult(result, "Impossible de sauvegarder les paramètres du site.");
              setSavingSite(false);
            }}
          >
            {savingSite ? "Enregistrement..." : "Enregistrer les paramètres du site"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

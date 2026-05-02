"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [orderAutoRefresh, setOrderAutoRefresh] = useState(false);
  const [supportEmail, setSupportEmail] = useState("esprit.creativadeco@gmail.com");

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Préférences Admin</CardTitle>
            <CardDescription>Réglages de confort pour le tableau de bord.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-muted-foreground">Afficher les notifications admin.</p>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label htmlFor="orders-refresh">Auto-refresh commandes</Label>
                <p className="text-sm text-muted-foreground">Rafraîchir automatiquement la liste des commandes.</p>
              </div>
              <Switch
                id="orders-refresh"
                checked={orderAutoRefresh}
                onCheckedChange={setOrderAutoRefresh}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Email utilisé dans les pages publiques de support.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="support-email">Email support</Label>
              <Input
                id="support-email"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>
            <Button type="button" disabled>
              Enregistrer (bientôt)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

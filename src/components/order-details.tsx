"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderDetailsProps {
  order: any; // Using any for simplicity, but you should define a proper type
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-emerald-500">
            <CheckCircle className="mr-1 h-3 w-3" /> Livré
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-500">
            <Package className="mr-1 h-3 w-3" /> En cours
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="mr-1 h-3 w-3" /> En attente
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-purple-500">
            <Truck className="mr-1 h-3 w-3" /> Expédié
          </Badge>
        );
      case "cancelled":
        return <Badge className="bg-red-500">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link href="/">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Détails de la commande</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Commande #{order.orderNumber}</CardTitle>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-sm text-gray-500">
                Passée le {formatDate(order.createdAt)}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 font-medium">Articles</h3>
                  <div className="space-y-4 rounded-md border p-4">
                    {order.orderItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={item.product.images[0] || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between">
                            <Link
                              href={`/products/${item.product.id}`}
                              className="font-medium hover:underline"
                            >
                              {item.product.name}
                            </Link>
                            <p className="font-medium">{item.price} DA</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            {item.size} / {item.frame}
                            {item.subOption ? ` / ${item.subOption}` : ""}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantité: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 rounded-md border p-4">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{order.total} DA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>0 DA</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total</span>
                    <span>{order.total} DA</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Nom:</span> {order.customerName}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {order.customerEmail}
                </p>
                <p>
                  <span className="font-medium">Téléphone:</span>{" "}
                  {order.customerPhone}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adresse de livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Méthode de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Paiement à la livraison</p>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

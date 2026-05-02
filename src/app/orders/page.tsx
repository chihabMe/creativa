import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import OrdersTrackingForm from "@/components/orders-tracking-form";

export default function OrdersTrackingPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>Suivre ma commande</CardTitle>
              <CardDescription>
                Entrez votre numéro de commande (ex: ORD-XXXXXXXX) pour voir son statut.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTrackingForm />

              <p className="mt-4 text-sm text-gray-500">
                Vous avez déjà un numéro de commande? Ouvrez directement{" "}
                <Link href="/orders/ORD-XXXXXXXX" className="underline">
                  /orders/ORD-XXXXXXXX
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

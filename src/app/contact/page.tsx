import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Contact | CRÉATIVA DÉCO",
  description: "Contactez-nous pour toute question ou demande d'information",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactPageClient />
      <Footer />
    </>
  );
}

import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact | CRÉATIVA DÉCO",
  description: "Contactez-nous pour toute question ou demande d'information",
}

export default function ContactPage() {
  return <ContactPageClient />
}

import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "FAQ | CRÉATIVA DÉCO",
  description: "Questions fréquemment posées sur nos produits et services",
};
const faqs = [
  {
    question: "Comment passer une commande ?",
    answer: `Pour passer une commande, parcourez notre catalogue, sélectionnez les produits qui vous intéressent, ajoutez-les à votre panier, puis suivez les étapes du processus de commande. Vous pouvez choisir la livraison à domicile ou le retrait en magasin.`,
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer: `Les délais de livraison varient généralement entre 3 et 7 jours ouvrables selon votre localisation. Pour Alger, la livraison peut être effectuée sous 48h. Vous recevrez un appel téléphonique pour confirmer la date et l'heure de livraison.`,
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer: `Nous acceptons uniquement le paiement à la livraison. Vous payez directement au livreur lorsque vous recevez votre commande.`,
  },
  {
    question: "Puis-je modifier ou annuler ma commande ?",
    answer: `Vous pouvez modifier ou annuler votre commande dans les 24 heures suivant sa passation. Pour cela, contactez notre service client par téléphone au 05 52 79 66 95 ou par email à esprit.creativadeco@gmail.com.`,
  },
  {
    question: "Quelle est votre politique de retour ?",
    answer: `Si vous n'êtes pas satisfait de votre achat, vous pouvez retourner le produit dans les 7 jours suivant la réception. Le produit doit être dans son état d'origine, non utilisé et dans son emballage d'origine. Les frais de retour sont à la charge du client.`,
  },
  {
    question: "Proposez-vous des services d'installation ?",
    answer: `Oui, nous proposons des services d'installation pour certains de nos produits, notamment les grands tableaux et les miroirs. Ce service est disponible uniquement à Alger et ses environs. Des frais supplémentaires peuvent s'appliquer selon la complexité de l'installation.`,
  },
  {
    question: "Comment entretenir mes tableaux ?",
    answer: `Pour entretenir vos tableaux, utilisez un chiffon doux et sec pour enlever la poussière. Évitez d'utiliser des produits chimiques ou de l'eau directement sur la toile. Gardez vos tableaux à l'abri de la lumière directe du soleil et de l'humidité excessive.`,
  },
  {
    question: "Faites-vous des tableaux sur mesure ?",
    answer: `Oui, nous proposons des services de personnalisation et de création sur mesure. Contactez-nous avec vos idées et spécifications, et nous vous fournirons un devis personnalisé.`,
  },
];

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto min-h-screen px-4 py-12">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Questions fréquemment posées
        </h1>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="rounded-lg border"
              >
                <AccordionTrigger className="px-4 py-3 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3 pt-0">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </>
  );
}

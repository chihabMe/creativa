"use client"

import { motion } from "motion/react"
import { Package, UserCheck, Truck, HeadphonesIcon } from "lucide-react"

const features = [
  {
    icon: <Package className="h-8 w-8 text-pink-500" />,
    title: "Produit original",
    description: "Tous nos produits sont authentiques et de haute qualité",
  },
  {
    icon: <UserCheck className="h-8 w-8 text-pink-500" />,
    title: "Client satisfait",
    description: "La satisfaction de nos clients est notre priorité",
  },
  {
    icon: <Truck className="h-8 w-8 text-pink-500" />,
    title: "Livraison à domicile",
    description: "Livraison rapide et sécurisée partout en Algérie",
  },
  {
    icon: <HeadphonesIcon className="h-8 w-8 text-pink-500" />,
    title: "Support client",
    description: "Notre équipe est disponible pour vous aider",
  },
]

export default function Features() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-4 rounded-full bg-white p-4 shadow-md">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">À propos de CREATIVA DÉCO</h3>
            <p className="text-sm text-gray-300">
              Creativa Deco est une entreprise spécialisée dans la décoration murale, animée par une véritable passion
              pour l'art et les couleurs. Notre mission est d'apporter une touche d'élégance, de modernité à votre
              intérieur, créant ainsi un environnement chaleureux, convivial et source d'inspiration.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liens rapides</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="#" className="hover:text-white hover:underline">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white hover:underline">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <address className="not-italic">
              <p className="mb-2 text-sm text-gray-300">Dely Brahim rue ahmed Ouaked - devant la banque ABC - Alger</p>
              <p className="mb-2 text-sm text-gray-300">05 52 79 66 95</p>
              <p className="text-sm text-gray-300">esprit.creativadeco@gmail.com</p>
            </address>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Suivez-nous</h3>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-pink-500">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-pink-500">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-pink-500">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <div className="mb-4 flex flex-wrap justify-center gap-4">
            <Link href="#" className="hover:text-white hover:underline">
              À propos
            </Link>
            <Link href="#" className="hover:text-white hover:underline">
              Services
            </Link>
            <Link href="#" className="hover:text-white hover:underline">
              FAQ
            </Link>
            <Link href="#" className="hover:text-white hover:underline">
              Contact
            </Link>
            <Link href="#" className="hover:text-white hover:underline">
              Confidentialité
            </Link>
            <Link href="#" className="hover:text-white hover:underline">
              Conditions Générales de Vente
            </Link>
            <Link href="#" className="hover:text-white hover:underline">
              Magasins
            </Link>
            <Link href="#" className="hover:text-white hover:underline">
              Guide d'achat
            </Link>
          </div>
          <p>© 2023 CREATIVA DECO - Site web e-commerce réalisé par</p>
        </div>
      </div>
    </footer>
  )
}

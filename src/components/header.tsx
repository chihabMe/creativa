"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import * as motion from "motion/react-m";
import { Search, ShoppingCart, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import MobileMenu from "./mobile-menu";
import Cart from "./cart";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";

// Updated navigation items with proper category slugs
const navItems = [
  { name: "TOUS LES MODÈLES (Trois-Duo )", href: "#", isDropdown: true },
  {
    name: "GRAND TABLEAUX",
    href: "/category/grand-tableaux",
    isDropdown: false,
  },
  { name: "VASES", href: "/category/vases", isDropdown: false },
  { name: "MIROIRS", href: "/category/miroirs", isDropdown: false },
  { name: "BOUGIES", href: "/category/bougies", isDropdown: false },
];

// Categories for the dropdown
const dropdownCategories = [
  {
    title: "Modèles",
    items: [
      { name: "Nouveautés", href: "/category/nouveautes" },
      { name: "Collections", href: "/category/collections" },
      { name: "Promotions", href: "/category/promotions" },
      { name: "Meilleures ventes", href: "/category/meilleures-ventes" },
    ],
  },
  {
    title: "Catégories",
    items: [
      { name: "Islamique", href: "/category/islamique" },
      { name: "Abstrait", href: "/category/abstrait" },
      { name: "Botanique", href: "/category/botanique" },
      { name: "Minimaliste", href: "/category/minimaliste" },
    ],
  },
  {
    title: "Styles",
    items: [
      { name: "Moderne", href: "/category/moderne" },
      { name: "Classique", href: "/category/classique" },
      { name: "Contemporain", href: "/category/contemporain" },
      { name: "Bohème", href: "/category/boheme" },
    ],
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white transition-all duration-200",
        isScrolled ? "shadow-md" : ""
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Creativa Deco"
              width={120}
              height={40}
              priority
            />
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <motion.li
                  key={item.name}
                  className={item.isDropdown ? "relative group" : ""}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 transition-colors hover:text-black"
                  >
                    {item.name}
                    {item.isDropdown && (
                      <motion.span
                        animate={{ rotate: 0 }}
                        className="transition-transform duration-200 group-hover:rotate-180"
                      >
                        ▼
                      </motion.span>
                    )}
                  </Link>

                  {/* Mega Dropdown only for "TOUS LES MODÈLES" */}
                  {item.isDropdown && (
                    <motion.div
                      className="absolute left-0 top-full z-50 mt-2 hidden w-screen max-w-screen-lg rounded-md border bg-white p-6 shadow-lg group-hover:flex"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="grid w-full grid-cols-4 gap-8">
                        {dropdownCategories.map((category, index) => (
                          <div key={index}>
                            <h3 className="mb-3 border-b pb-2 text-lg font-semibold">
                              {category.title}
                            </h3>
                            <ul className="space-y-2">
                              {category.items.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <Link
                                    href={subItem.href}
                                    className="text-sm text-gray-600 hover:text-black hover:underline"
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        <div className="flex flex-col justify-between">
                          <div>
                            <h3 className="mb-3 border-b pb-2 text-lg font-semibold">
                              Offre spéciale
                            </h3>
                            <p className="mb-2 text-sm text-gray-600">
                              Découvrez notre collection exclusive
                            </p>
                            <Link
                              href="/category/exclusives"
                              className="inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/80"
                            >
                              Voir plus
                            </Link>
                          </div>
                          <div className="mt-4 rounded-md bg-gray-100 p-3">
                            <p className="text-xs font-medium text-gray-800">
                              Livraison gratuite pour toute commande supérieure
                              à 10 000 DA
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" aria-label="Search" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Favoris" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>

          <Cart />

          <div className="md:hidden">
            <MobileMenu items={navItems} />
          </div>
        </div>
      </div>
    </header>
  );
}

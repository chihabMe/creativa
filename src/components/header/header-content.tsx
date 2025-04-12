"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, Heart, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import MobileMenu from "../mobile-menu"
import Cart from "../cart"

// Import shadcn navigation menu components
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { getCategories } from "@/lib/actions/ category-actions"

type Category = Awaited<ReturnType<typeof getCategories>>[0]
interface HeaderProps {
  featuredCategories: Category[]
  groupedCategories: Record<string, Category[]>
}

export default function HeaderContent({ featuredCategories, groupedCategories }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const { totalItems, openCart } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn("sticky top-0 z-50 w-full bg-white transition-all duration-200", isScrolled ? "shadow-md" : "")}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Creativa Deco" width={120} height={40} priority />
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              {/* Categories Dropdown using shadcn */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium text-gray-700 hover:text-black">
                  TOUS LES MODÈLES
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[800px] grid-cols-3 gap-8 p-6">
                    {Object.entries(groupedCategories).map(([groupName, categories], index) => (
                      <div key={index}>
                        <h3 className="mb-3 border-b pb-2 text-lg font-semibold">{groupName}</h3>
                        <ul className="space-y-2">
                          {categories.map((category) => (
                            <li key={category.id}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={`/category/${category.slug}`}
                                  className="text-sm text-gray-600 hover:text-black hover:underline"
                                >
                                  {category.name}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="mb-3 border-b pb-2 text-lg font-semibold">Offre spéciale</h3>
                        <p className="mb-2 text-sm text-gray-600">Découvrez notre collection exclusive</p>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/category/exclusives"
                            className="inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/80"
                          >
                            Voir plus
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <div className="mt-4 rounded-md bg-gray-100 p-3">
                        <p className="text-xs font-medium text-gray-800">
                          Livraison gratuite pour toute commande supérieure à 10 000 DA
                        </p>
                      </div>
                    </div> */}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Featured Categories */}
              {featuredCategories.map((category) => (
                <NavigationMenuItem key={category.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-sm font-medium text-gray-700 transition-colors hover:text-black px-4 py-2 block"
                    >
                      {category.name.toUpperCase()}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
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
          <Button variant="ghost" size="icon" aria-label="Cart" onClick={openCart}>
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {totalItems}
              </span>
            </div>
          </Button>
        </div>

        {/* Mobile Layout */}
        <div className="flex w-full items-center justify-between md:hidden">
          {/* Mobile Menu Trigger on Left */}
          <div>
            <MobileMenu
              featuredCategories={featuredCategories}
              groupedCategories={groupedCategories}
              includeSearch={true}
            />
          </div>

          {/* Logo in Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="Creativa Deco" width={100} height={35} priority />
            </Link>
          </div>

          {/* Cart on Right */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Favoris" asChild className="h-8 w-8">
              <Link href="/wishlist">
                <Heart className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" aria-label="Cart" onClick={openCart} className="h-8 w-8">
              <div className="relative">
                <ShoppingCart className="h-4 w-4" />
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {totalItems}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
      <Cart />
    </header>
  )
}
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { getCategories } from "@/lib/actions/ category-actions"

type Category = Awaited<ReturnType<typeof getCategories>>[0]
interface MobileMenuProps {
  featuredCategories: Category[]
  groupedCategories: Record<string, Category[]>
  includeSearch?: boolean
}

export default function MobileMenu({ featuredCategories, groupedCategories, includeSearch = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
      setIsOpen(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex justify-between items-center">
            Menu
          </SheetTitle>
        </SheetHeader>

        {includeSearch && (
          <div className="p-4 border-b">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}

        <div className="py-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          <nav>
            <ul className="space-y-1">
              {/* Featured Categories */}
              {featuredCategories.map((category) => (
                <li key={category.id}>
                  <SheetClose asChild>
                    <Link
                      href={`/category/${category.slug}`}
                      className="flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-100"
                    >
                      {category.name}
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </Link>
                  </SheetClose>
                </li>
              ))}

              {/* Grouped Categories */}
              <li>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="categories" className="border-none">
                    <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:bg-gray-100">
                      Toutes les catégories
                    </AccordionTrigger>
                    <AccordionContent>
                      {Object.entries(groupedCategories).map(([groupName, categories]) => (
                        <div key={groupName} className="mb-4">
                          <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">{groupName}</h3>
                          <ul className="space-y-1">
                            {categories.map((category) => (
                              <li key={category.id}>
                                <SheetClose asChild>
                                  <Link
                                    href={`/category/${category.slug}`}
                                    className="flex items-center px-6 py-2 text-sm hover:bg-gray-100"
                                  >
                                    {category.name}
                                  </Link>
                                </SheetClose>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </li>

              {/* Other Links */}
              <li>
                <SheetClose asChild>
                  <Link href="/wishlist" className="flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-100">
                    Mes favoris
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Link>
                </SheetClose>
              </li>
              <li>
                <SheetClose asChild>
                  <Link href="/contact" className="flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-100">
                    Contact
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Link>
                </SheetClose>
              </li>
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

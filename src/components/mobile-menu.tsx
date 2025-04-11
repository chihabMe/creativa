"use client"

import { useState } from "react"
import Link from "next/link"
import *as motion from "motion/react-m"
import { Menu  } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface MobileMenuProps {
  items: { name: string; href: string }[]
}

export default function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] px-4 pt-4">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-lg font-semibold">Menu</span>
          </div>
          <nav className="flex-1 overflow-auto py-6">
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <motion.li key={item.name} whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }} className="border-b pb-2">
                  <Link
                    href={item.href}
                    className="block text-base font-medium text-gray-700 transition-colors hover:text-black"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

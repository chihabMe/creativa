"use client";
import { useState } from "react";
import Link from "next/link";
import * as motion from "motion/react-m";
import { Menu, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

interface MobileMenuProps {
  items: { name: string; href: string; isDropdown?: boolean }[];
  includeSearch?: boolean;
}

export default function MobileMenu({ items, includeSearch = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] px-4 pt-4">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-lg font-semibold">Menu</span>
          </div>

          {includeSearch && (
            <div className="py-4 border-b">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" variant="ghost">
                  <Search className="h-5 w-5" />
                </Button>
              </form>
            </div>
          )}

          <nav className="flex-1 overflow-auto py-6">
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <motion.li 
                  key={item.name} 
                  whileHover={{ x: 5 }} 
                  whileTap={{ scale: 0.95 }} 
                  className="border-b pb-2"
                >
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

          <div className="border-t pt-4">
            <Link
              href="/wishlist"
              className="flex items-center gap-2 text-gray-700 hover:text-black py-2"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="h-5 w-5" />
              <span>Mes favoris</span>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
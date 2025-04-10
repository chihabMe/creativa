"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Prevent hydration errors
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  // Skip rendering the admin layout on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === "/admin",
    },
    {
      href: "/admin/products",
      label: "Produits",
      icon: <Package className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/products" || pathname === "/admin/products/new",
    },
    {
      href: "/admin/orders",
      label: "Commandes",
      icon: <ShoppingCart className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/orders",
    },
    {
      href: "/admin/customers",
      label: "Clients",
      icon: <Users className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/customers",
    },
    {
      href: "/admin/settings",
      label: "Paramètres",
      icon: <Settings className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/settings",
    },
  ]

  const handleSignOut = () => {
    signOut({ callbackUrl: "/admin/login" })
  }

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "AD"

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Mobile Navigation */}
      <div className="flex items-center justify-between border-b bg-white p-4 lg:hidden">
        <Link href="/admin" className="flex items-center">
          <h1 className="text-xl font-bold">CREATIVA DÉCO Admin</h1>
        </Link>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "Admin"} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0">
              <div className="flex h-full flex-col">
                <div className="border-b p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-4">
                    <nav className="flex flex-col space-y-1">
                      {routes.map((route) => (
                        <Link
                          key={route.href}
                          href={route.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            route.active
                              ? "bg-black text-white"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                          )}
                        >
                          {route.icon}
                          {route.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </ScrollArea>
                <div className="border-t p-4">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/">
                      <LogOut className="mr-2 h-4 w-4" />
                      Retour au site
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex">
        <aside className="fixed inset-y-0 left-0 z-10 w-64 border-r bg-white">
          <div className="flex h-full flex-col">
            <div className="border-b p-6">
              <Link href="/admin" className="flex items-center">
                <h1 className="text-xl font-bold">CREATIVA DÉCO</h1>
              </Link>
              <p className="text-xs text-gray-500">Administration</p>
            </div>
            <ScrollArea className="flex-1 py-4">
              <nav className="space-y-1 px-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      route.active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    )}
                  >
                    {route.icon}
                    {route.label}
                  </Link>
                ))}
              </nav>
            </ScrollArea>
            <div className="border-t p-4 space-y-4">
              <div className="flex items-center space-x-3 rounded-md bg-gray-50 p-3">
                <Avatar>
                  <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "Admin"} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium">{session?.user?.name || "Admin"}</p>
                  <p className="truncate text-xs text-gray-500">{session?.user?.email}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    Retour au site
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </aside>
        <main className="ml-64 flex-1">{children}</main>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden">{children}</div>
    </div>
  )
}

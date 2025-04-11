"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  size: string
  frame: string
  image: string
}

type CartContextType = {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  totalPrice: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart-items")
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart)
        setItems(parsedCart)
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Update localStorage when cart changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart-items", JSON.stringify(items))
    }
  }, [items, isInitialized])

  // Calculate totals when items change
  useEffect(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0)
    const price = items.reduce((total, item) => total + item.price * item.quantity, 0)

    setTotalItems(itemCount)
    setTotalPrice(price)
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === item.id && i.size === item.size && i.frame === item.frame,
      )

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        }
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, item]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const openCart = () => {
    setIsOpen(true)
  }

  const closeCart = () => {
    setIsOpen(false)
  }

  const value = {
    items,
    isOpen,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

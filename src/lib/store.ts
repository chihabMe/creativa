import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  size: string
  frame: string
  image: string
}

type CartState = {
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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find(
          (i) => i.id === item.id && i.size === item.size && i.frame === item.frame,
        )

        if (existingItem) {
          const updatedItems = currentItems.map((i) =>
            i.id === item.id && i.size === item.size && i.frame === item.frame
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          )

          set((state) => ({
            items: updatedItems,
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + item.price * item.quantity,
          }))
        } else {
          set((state) => ({
            items: [...state.items, item],
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + item.price * item.quantity,
          }))
        }
      },

      removeItem: (id) => {
        const itemToRemove = get().items.find((item) => item.id === id)
        if (!itemToRemove) return

        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          totalItems: state.totalItems - itemToRemove.quantity,
          totalPrice: state.totalPrice - itemToRemove.price * itemToRemove.quantity,
        }))
      },

      updateQuantity: (id, quantity) => {
        const currentItems = get().items
        const itemToUpdate = currentItems.find((item) => item.id === id)

        if (!itemToUpdate) return

        const quantityDiff = quantity - itemToUpdate.quantity

        const updatedItems = currentItems.map((item) => (item.id === id ? { ...item, quantity } : item))

        set((state) => ({
          items: updatedItems,
          totalItems: state.totalItems + quantityDiff,
          totalPrice: state.totalPrice + itemToUpdate.price * quantityDiff,
        }))
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        })
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)

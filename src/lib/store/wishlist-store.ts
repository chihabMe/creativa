import { create } from "zustand"
import { persist } from "zustand/middleware"

type WishlistState = {
  items: string[] // Product IDs
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        set((state) => ({
          items: [...state.items, productId],
        }))
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }))
      },

      isInWishlist: (productId) => {
        return get().items.includes(productId)
      },
    }),
    {
      name: "wishlist-storage",
    },
  ),
)

import { create } from "zustand"
import { persist } from "zustand/middleware"

type RecentlyViewedState = {
  items: string[] // Product IDs
  addItem: (productId: string) => void
  getItems: (limit?: number) => string[]
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        set((state) => {
          // Remove the product if it already exists
          const filteredItems = state.items.filter((id) => id !== productId)

          // Add the product to the beginning of the array
          return {
            items: [productId, ...filteredItems].slice(0, 20), // Keep only the 20 most recent
          }
        })
      },

      getItems: (limit = 10) => {
        return get().items.slice(0, limit)
      },
    }),
    {
      name: "recently-viewed-storage",
    },
  ),
)

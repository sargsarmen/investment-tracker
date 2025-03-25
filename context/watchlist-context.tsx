"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

// Initial watchlist items
const initialWatchlistItems = [
  {
    id: "1",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 487.21,
    change: 12.34,
    changePercent: 2.6,
    peRatio: 45.2,
    marketCap: "1.2T",
    volume: "32.5M",
    avgVolume: "45.2M",
    dividend: 0.16,
    dividendYield: 0.03,
  },
  {
    id: "2",
    symbol: "AMD",
    name: "Advanced Micro Devices",
    price: 176.52,
    change: -3.21,
    changePercent: -1.78,
    peRatio: 38.7,
    marketCap: "285.3B",
    volume: "45.8M",
    avgVolume: "62.3M",
    dividend: 0,
    dividendYield: 0,
  },
  {
    id: "3",
    symbol: "INTC",
    name: "Intel Corporation",
    price: 42.87,
    change: 0.54,
    changePercent: 1.27,
    peRatio: 22.1,
    marketCap: "180.5B",
    volume: "28.7M",
    avgVolume: "35.2M",
    dividend: 0.5,
    dividendYield: 1.17,
  },
  {
    id: "4",
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 147.03,
    change: 2.15,
    changePercent: 1.48,
    peRatio: 75.4,
    marketCap: "1.5T",
    volume: "35.2M",
    avgVolume: "42.8M",
    dividend: 0,
    dividendYield: 0,
  },
  {
    id: "5",
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 234.3,
    change: -5.67,
    changePercent: -2.36,
    peRatio: 84.2,
    marketCap: "743.8B",
    volume: "92.5M",
    avgVolume: "105.7M",
    dividend: 0,
    dividendYield: 0,
  },
]

export interface WatchlistItem {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  peRatio?: number
  marketCap?: string
  volume?: string
  avgVolume?: string
  dividend?: number
  dividendYield?: number
}

interface WatchlistContextType {
  items: WatchlistItem[]
  isLoading: boolean
  addItem: (item: WatchlistItem) => void
  updateItem: (item: WatchlistItem) => void
  removeItem: (id: string) => void
  removedItems: Record<string, WatchlistItem>
  restoreItem: (id: string) => void
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider")
  }
  return context
}

interface WatchlistProviderProps {
  children: ReactNode
}

export function WatchlistProvider({ children }: WatchlistProviderProps) {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removedItems, setRemovedItems] = useState<Record<string, WatchlistItem>>({})
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize watchlist on first load
  useEffect(() => {
    if (!isInitialized) {
      setItems(initialWatchlistItems)
      setIsLoading(false)
      setIsInitialized(true)
    }
  }, [isInitialized])

  const addItem = (newItem: WatchlistItem) => {
    setItems((prev) => [...prev, newItem])
  }

  const updateItem = (updatedItem: WatchlistItem) => {
    setItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
  }

  const removeItem = (id: string) => {
    const itemToRemove = items.find((item) => item.id === id)

    if (!itemToRemove) return

    // Update items (remove the item)
    const newItems = items.filter((item) => item.id !== id)
    setItems(newItems)

    // Store the removed item for potential restoration
    setRemovedItems((prev) => ({
      ...prev,
      [id]: itemToRemove,
    }))

    // Show toast with undo functionality
    toast(`${itemToRemove.symbol} removed from watchlist`, {
      description: `Current price: $${itemToRemove.price.toFixed(2)}`,
      action: {
        label: "Undo",
        onClick: () => restoreItem(id),
      },
    })
  }

  const restoreItem = (id: string) => {
    const itemToRestore = removedItems[id]

    if (!itemToRestore) return

    // Restore the item
    setItems((prev) => [...prev, itemToRestore])

    // Remove from the removed items record
    setRemovedItems((prev) => {
      const newRemoved = { ...prev }
      delete newRemoved[id]
      return newRemoved
    })

    toast.success(`${itemToRestore.symbol} restored to watchlist`)
  }

  const value = {
    items,
    isLoading,
    addItem,
    updateItem,
    removeItem,
    removedItems,
    restoreItem,
  }

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}


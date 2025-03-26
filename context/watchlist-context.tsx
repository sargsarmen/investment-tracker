"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useRef } from "react"
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
  const [removedItems, setRemovedItems] = useState<Record<string, { item: WatchlistItem, index: number }>>({})
  const [isInitialized, setIsInitialized] = useState(false)
  const restoreRef = useRef<Function>(undefined)

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

  const restoreItem = (id: string) => {
    const toRestore = removedItems[id]

    if (!toRestore) return

    const { item, index } = toRestore;

    // Restore the item
    setItems((prev) => {
      const copyItems = [...prev];
      if (index !== undefined) {
        copyItems.splice(index, 0, item)
      } else {
        copyItems.push(item)
      }

      return copyItems
    })

    // Remove from the removed items record
    setRemovedItems((prev) => {
      const newRemoved = { ...prev }
      delete newRemoved[id]
      return newRemoved
    })

    toast.success(`${item.symbol} restored to watchlist`)
  }

  restoreRef.current = restoreItem;

  const removeItem = (id: string) => {
    const itemToRemove = items.find((item) => item.id === id)

    if (!itemToRemove) return

    // Update items (remove the item)
    const newItems = items.filter((item) => item.id !== id)
    setItems(newItems)

    // Store the removed item for potential restoration
    setRemovedItems((prev) => ({
      ...prev,
      [id]: { item: itemToRemove, index: items.findIndex((item) => item.id === id) },
    }))

    // Show toast with undo functionality
    toast(`${itemToRemove.symbol} removed from watchlist`, {
      description: `Current price: $${itemToRemove.price.toFixed(2)}`,
      action: {
        label: "Undo",
        onClick: () => restoreRef.current?.(id),
      },
    })
  }

  const value = {
    items,
    isLoading,
    addItem,
    updateItem,
    removeItem,
    restoreItem,
  }

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}


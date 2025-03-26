"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useRef } from "react"
import { fetchPortfolioWithPrices, calculateAllocations } from "@/lib/api-service"
import { toast } from "sonner"

// Initial holdings data
const initialHoldings = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 15,
    avgCost: 145.75,
    currentPrice: 0,
    value: 0,
    gain: 0,
    gainPercent: 0,
    allocation: 0,
  },
  {
    id: "2",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    shares: 10,
    avgCost: 287.65,
    currentPrice: 0,
    value: 0,
    gain: 0,
    gainPercent: 0,
    allocation: 0,
  },
  {
    id: "3",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    shares: 8,
    avgCost: 115.22,
    currentPrice: 0,
    value: 0,
    gain: 0,
    gainPercent: 0,
    allocation: 0,
  },
  {
    id: "4",
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    shares: 12,
    avgCost: 120.35,
    currentPrice: 0,
    value: 0,
    gain: 0,
    gainPercent: 0,
    allocation: 0,
  },
  {
    id: "5",
    symbol: "TSLA",
    name: "Tesla Inc.",
    shares: 20,
    avgCost: 190.75,
    currentPrice: 0,
    value: 0,
    gain: 0,
    gainPercent: 0,
    allocation: 0,
  },
]

export interface Position {
  id: string
  symbol: string
  name: string
  shares: number
  avgCost: number
  currentPrice: number
  value: number
  gain: number
  gainPercent: number
  allocation: number
}

interface PortfolioContextType {
  holdings: Position[]
  isLoading: boolean
  isRefreshing: boolean
  addPosition: (position: Position) => void
  updatePosition: (position: Position) => void
  removePosition: (id: string) => void
  refreshPortfolio: () => Promise<void>
  restorePosition: (id: string) => void
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider")
  }
  return context
}

interface PortfolioProviderProps {
  children: ReactNode
}

export function PortfolioProvider({ children }: PortfolioProviderProps) {
  const [holdings, setHoldings] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [removedPositions, setRemovedPositions] = useState<Record<string, { position: Position; index: number }>>({})
  const [isInitialized, setIsInitialized] = useState(false)
  const restorePositionRef = useRef<Function>(undefined)

  // Initialize portfolio on first load
  useEffect(() => {
    if (!isInitialized) {
      refreshPortfolio()
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Function to refresh portfolio with current prices
  const refreshPortfolio = async () => {
    try {
      setIsRefreshing(true)

      // Only use initialHoldings when we're initializing for the first time
      // For refresh actions, only update existing holdings
      if (holdings.length === 0 && !isInitialized) {
        // First load - use initial data
        const updatedPortfolio = await fetchPortfolioWithPrices(initialHoldings)
        const portfolioWithAllocations = calculateAllocations(updatedPortfolio)
        setHoldings(portfolioWithAllocations)
      } else if (holdings.length > 0) {
        // Refresh existing holdings only
        const updatedPortfolio = await fetchPortfolioWithPrices(holdings)
        const portfolioWithAllocations = calculateAllocations(updatedPortfolio)
        setHoldings(portfolioWithAllocations)
      }
    } catch (error) {
      toast.error("Failed to refresh portfolio", {
        description: "There was an error fetching current prices. Please try again.",
      })
      console.error("Error refreshing portfolio:", error)

      // If this is the first load and it failed, use the initial data without prices
      if (holdings.length === 0 && !isInitialized) {
        setHoldings(initialHoldings)
      }
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const addPosition = async (newPosition: Position) => {
    try {
      setHoldings((prev) => {
        const newHoldings = [...prev, newPosition]
        return calculateAllocations(newHoldings)
      })
    } catch (error) {
      toast.error("Failed to add position", {
        description: "There was an error updating your portfolio. Please try again.",
      })
      console.error("Error adding position:", error)
    }
  }

  const updatePosition = async (updatedPosition: Position) => {
    try {
      setHoldings((prev) => {
        const newHoldings = prev.map((position) => (position.id === updatedPosition.id ? updatedPosition : position))
        return calculateAllocations(newHoldings)
      })
    } catch (error) {
      toast.error("Failed to update position", {
        description: "There was an error updating your portfolio. Please try again.",
      })
      console.error("Error updating position:", error)
    }
  }

  const restorePosition = async (id: string) => {
    const toRestore = removedPositions[id]

    if (!toRestore) return

    const { position, index } = toRestore

    try {
      // Get current price for the removed position
      const updatedPositions = await fetchPortfolioWithPrices([position])
      const updatedPosition = updatedPositions[0]

      // Restore the position
      setHoldings((prev) => {
        const restoredHoldings = [...prev]
        if (index !== undefined) {
          restoredHoldings.splice(index, 0, updatedPosition)
        } else {
          restoredHoldings.push(updatedPosition)
        }

        return calculateAllocations(restoredHoldings)
      })

      toast.success(`${position.symbol} restored to portfolio`)
    } catch (error) {
      // If there's an error, still restore the position but with old data
      setHoldings((prev) => {
        const restoredHoldings = [...prev]
        if (index !== undefined) {
          restoredHoldings.splice(index, 0, position)
        } else {
          restoredHoldings.push(position)
        }

        return calculateAllocations(restoredHoldings)
      })

      // Remove from the removed positions record
      setRemovedPositions((prev) => {
        const newRemoved = { ...prev }
        delete newRemoved[id]
        return newRemoved
      })

      toast.success(`${position.symbol} restored to portfolio`, {
        description: "Price data may be outdated",
      })
    }
  }

  restorePositionRef.current = restorePosition

  const removePosition = (id: string) => {
    const positionToRemove = holdings.find((item) => item.id === id)

    if (!positionToRemove) return

    // Update holdings (remove the position)
    const newHoldings = holdings.filter((item) => item.id !== id)
    const recalculatedHoldings = calculateAllocations(newHoldings)
    setHoldings(recalculatedHoldings)

    // Store the removed position for potential restoration
    setRemovedPositions((prev) => ({
      ...prev,
      [id]: { position: positionToRemove, index: holdings.findIndex((item) => item.id === id) },
    }))

    // Show toast with undo functionality
    toast(`${positionToRemove.symbol} removed from portfolio`, {
      description: `${positionToRemove.shares} shares at $${positionToRemove.avgCost.toFixed(2)}`,
      action: {
        label: "Undo",
        onClick: () => restorePositionRef.current?.(id),
      },
    })
  }

  const value = {
    holdings,
    isLoading,
    isRefreshing,
    addPosition,
    updatePosition,
    removePosition,
    refreshPortfolio,
    restorePosition,
  }

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}


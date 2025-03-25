"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"
import { calculatePortfolioPerformance } from "@/lib/api-service"
import { usePortfolio } from "@/context/portfolio-context"

export default function PerformanceMetrics() {
  const { holdings, isLoading: portfolioLoading } = usePortfolio()
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalReturn: 0,
    totalReturnPercent: 0,
    ytdReturn: 0,
    ytdReturnPercent: 0,
    annualizedReturnPercent: 0,
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      if (portfolioLoading) return

      setIsLoading(true)
      try {
        const performance = await calculatePortfolioPerformance(holdings)
        setMetrics({
          totalReturn: performance.totalReturn,
          totalReturnPercent: performance.totalReturnPercent,
          ytdReturn: performance.ytdReturn,
          ytdReturnPercent: performance.ytdReturnPercent,
          annualizedReturnPercent: performance.annualizedReturnPercent,
        })
      } catch (error) {
        console.error("Error calculating portfolio performance:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [holdings, portfolioLoading])

  const metricsCards = [
    {
      title: "Total Return",
      value: `${metrics.totalReturnPercent >= 0 ? "+" : ""}${metrics.totalReturnPercent.toFixed(2)}%`,
      change: `${metrics.totalReturn >= 0 ? "+" : ""}$${Math.abs(metrics.totalReturn).toFixed(2)}`,
      trend: metrics.totalReturn >= 0 ? "up" : "down",
      description: "Since inception",
    },
    {
      title: "YTD Return",
      value: `${metrics.ytdReturnPercent >= 0 ? "+" : ""}${metrics.ytdReturnPercent.toFixed(2)}%`,
      change: `${metrics.ytdReturn >= 0 ? "+" : ""}$${Math.abs(metrics.ytdReturn).toFixed(2)}`,
      trend: metrics.ytdReturn >= 0 ? "up" : "down",
      description: "Year to date",
    },
    {
      title: "Annualized Return",
      value: `${metrics.annualizedReturnPercent >= 0 ? "+" : ""}${metrics.annualizedReturnPercent.toFixed(2)}%`,
      change: "",
      trend: metrics.annualizedReturnPercent >= 0 ? "up" : "down",
      description: "3-year average",
    },
  ]

  return (
    <>
      {metricsCards.map((card, index) => (
        <Card
          key={index}
          className={`border transition-all duration-300 hover:shadow-md ${isLoading || portfolioLoading ? "animate-pulse" : ""}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || portfolioLoading ? (
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.trend === "up" && card.change && (
                    <span className="text-emerald-500 flex items-center">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      {card.change}
                    </span>
                  )}
                  {card.trend === "down" && card.change && (
                    <span className="text-red-500 flex items-center">
                      <ArrowDown className="mr-1 h-4 w-4" />
                      {card.change}
                    </span>
                  )}{" "}
                  {card.description}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  )
}


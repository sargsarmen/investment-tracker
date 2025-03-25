"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, DollarSign, Percent } from "lucide-react"
import { usePortfolio } from "@/context/portfolio-context"

export default function PortfolioSummary() {
  const { holdings, isLoading } = usePortfolio()
  const [summaryData, setSummaryData] = useState({
    totalValue: 0,
    dayChange: 0,
    dayChangePercent: 0,
    totalReturn: 0,
    totalReturnPercent: 0,
  })

  useEffect(() => {
    if (!isLoading && holdings.length > 0) {
      // Calculate summary data
      const totalValue = holdings.reduce((sum, position) => sum + position.value, 0)
      const totalCost = holdings.reduce((sum, position) => sum + position.avgCost * position.shares, 0)
      const totalReturn = totalValue - totalCost
      const totalReturnPercent = (totalReturn / totalCost) * 100

      // Simulate day change (in a real app, this would come from the API)
      const dayChange = totalValue * (Math.random() * 0.04 - 0.02) // Random between -2% and 2%
      const dayChangePercent = (dayChange / totalValue) * 100

      setSummaryData({
        totalValue,
        dayChange,
        dayChangePercent,
        totalReturn,
        totalReturnPercent,
      })
    }
  }, [holdings, isLoading])

  const summaryCards = [
    {
      title: "Total Value",
      value: `$${summaryData.totalValue.toFixed(2)}`,
      change: `${summaryData.totalReturn >= 0 ? "+" : ""}$${summaryData.totalReturn.toFixed(2)}`,
      changePercent: `${summaryData.totalReturnPercent >= 0 ? "+" : ""}${summaryData.totalReturnPercent.toFixed(2)}%`,
      trend: summaryData.totalReturn >= 0 ? "up" : "down",
      icon: DollarSign,
    },
    {
      title: "Day Change",
      value: `${summaryData.dayChange >= 0 ? "+" : ""}$${summaryData.dayChange.toFixed(2)}`,
      change: `${summaryData.dayChangePercent >= 0 ? "+" : ""}${summaryData.dayChangePercent.toFixed(2)}%`,
      changePercent: "",
      trend: summaryData.dayChange >= 0 ? "up" : "down",
      icon: ArrowUp,
    },
    {
      title: "Total Return",
      value: `${summaryData.totalReturn >= 0 ? "+" : ""}$${summaryData.totalReturn.toFixed(2)}`,
      change: `${summaryData.totalReturnPercent >= 0 ? "+" : ""}${summaryData.totalReturnPercent.toFixed(2)}%`,
      changePercent: "",
      trend: summaryData.totalReturn >= 0 ? "up" : "down",
      icon: Percent,
    },
  ]

  return (
    <>
      {summaryCards.map((card, index) => (
        <Card key={index} className={isLoading ? "animate-pulse" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.trend === "up" && (
                    <span className="text-emerald-500 flex items-center">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      {card.change} {card.changePercent}
                    </span>
                  )}
                  {card.trend === "down" && (
                    <span className="text-red-500 flex items-center">
                      <ArrowDown className="mr-1 h-4 w-4" />
                      {card.change} {card.changePercent}
                    </span>
                  )}
                  {card.trend === "neutral" && <span className="text-muted-foreground">{card.change}</span>}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { generatePortfolioHistoricalData } from "@/lib/api-service"
import { usePortfolio } from "@/context/portfolio-context"

type TimeRange = "1M" | "3M" | "6M" | "1Y" | "5Y" | "All"

interface PortfolioPerformanceChartProps {
  detailed?: boolean
}

export default function PortfolioPerformanceChart({ detailed = false }: PortfolioPerformanceChartProps) {
  const { holdings, isLoading: portfolioLoading } = usePortfolio()
  const [timeRange, setTimeRange] = useState<TimeRange>("1Y")
  const [showBenchmark, setShowBenchmark] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (portfolioLoading) return

      setIsLoading(true)
      try {
        const data = await generatePortfolioHistoricalData(holdings, timeRange)
        setChartData(data)
      } catch (error) {
        console.error("Error fetching portfolio historical data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeRange, holdings, portfolioLoading])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {(["1M", "3M", "6M", "1Y", "5Y", "All"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowBenchmark(!showBenchmark)}>
          {showBenchmark ? "Hide Benchmark" : "Show Benchmark"}
        </Button>
      </div>

      <div className="h-[300px]">
        {isLoading || portfolioLoading ? (
          <div className="h-full w-full flex items-center justify-center bg-muted/20 animate-pulse rounded-md">
            <p className="text-muted-foreground">Loading chart data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `$${(value / 1000000).toFixed(1)}M`
                  } else if (value >= 1000) {
                    return `$${(value / 1000).toFixed(0)}k`
                  }
                  return `$${value.toFixed(0)}`
                }}
                domain={["dataMin - 1000", "dataMax + 1000"]}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Value"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Portfolio"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
              {showBenchmark && (
                <Line
                  type="monotone"
                  dataKey="sp500"
                  name="S&P 500"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="5 5"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}


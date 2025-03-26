"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { fetchBenchmarkData, fetchBenchmarkPerformance } from "@/lib/api-service"
import { usePortfolio } from "@/context/portfolio-context"
import { useIsMobile } from "@/hooks/use-mobile"
import clsx from "clsx"

type TimeRange = "1M" | "3M" | "6M" | "1Y" | "5Y" | "All"
type BenchmarkType = "sp500" | "nasdaq" | "dow"

export default function PerformanceComparison() {
  const { isLoading: portfolioLoading } = usePortfolio()
  const [timeRange, setTimeRange] = useState<TimeRange>("1Y")
  const [benchmarks, setBenchmarks] = useState<BenchmarkType[]>(["sp500"])
  const [chartData, setChartData] = useState<any[]>([])
  const [benchmarkPerformance, setBenchmarkPerformance] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    const fetchData = async () => {
      if (portfolioLoading) return

      setIsLoading(true)
      try {
        const data = await fetchBenchmarkData(timeRange)
        setChartData(data)

        const performance = await fetchBenchmarkPerformance()
        setBenchmarkPerformance(performance)
      } catch (error) {
        console.error("Error fetching benchmark data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeRange, portfolioLoading])

  const toggleBenchmark = (benchmark: BenchmarkType) => {
    if (benchmarks.includes(benchmark)) {
      setBenchmarks(benchmarks.filter((b) => b !== benchmark))
    } else {
      setBenchmarks([...benchmarks, benchmark])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(["1M", "3M", "6M", "1Y", "5Y", "All"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={clsx({ "hidden sm:block": range === 'All' })}
            >
              {range}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={benchmarks.includes("sp500") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleBenchmark("sp500")}
          >
            S&P 500
          </Button>
          <Button
            variant={benchmarks.includes("nasdaq") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleBenchmark("nasdaq")}
          >
            NASDAQ
          </Button>
          <Button
            variant={benchmarks.includes("dow") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleBenchmark("dow")}
          >
            Dow Jones
          </Button>
        </div>
      </div>

      <div className={isMobile ? "h-[280px]" : "h-[300px]"}>
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
                right: isMobile ? 0 : 10,
                left: isMobile ? 0 : 10,
                bottom: isMobile ? 0 : 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: isMobile ? 8 : 10 }}
                interval={isMobile ? "preserveEnd" : "preserveStartEnd"}
                tickFormatter={(value) => {
                  // For multi-year data, show abbreviated format
                  if (value.includes(" ")) {
                    const [month, year] = value.split(" ")
                    return `${month} ${year.slice(2)}`
                  }
                  return value
                }}
              />
              <YAxis
                domain={["dataMin - 5", "dataMax + 5"]}
                width={isMobile ? 35 : 40}
                tick={{ fontSize: isMobile ? 8 : 10 }}
                tickFormatter={(value) => {
                  if (isMobile) {
                    return value.toFixed(0)
                  }
                  return value.toFixed(2)
                }}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)}`, "Value"]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ fontSize: isMobile ? "10px" : "12px" }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: isMobile ? "9px" : "12px",
                  paddingTop: isMobile ? "0px" : "0px",
                  bottom: isMobile ? 0 : 5,
                }}
                iconSize={isMobile ? 8 : 10}
                iconType="circle"
                layout={isMobile ? "horizontal" : "horizontal"}
                verticalAlign="bottom"
                align="center"
              />
              <Line
                type="monotone"
                dataKey="portfolio"
                name="Your Portfolio"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: isMobile ? 6 : 8 }}
              />
              {benchmarks.includes("sp500") && (
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
              {benchmarks.includes("nasdaq") && (
                <Line
                  type="monotone"
                  dataKey="nasdaq"
                  name="NASDAQ"
                  stroke="#ff7300"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="3 3"
                />
              )}
              {benchmarks.includes("dow") && (
                <Line
                  type="monotone"
                  dataKey="dow"
                  name="Dow Jones"
                  stroke="#0088fe"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="1 1"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {benchmarkPerformance ? (
          <>
            <div className="border rounded-md p-3 transition-all duration-300 hover:shadow-md">
              <div className="text-sm text-muted-foreground">Your Portfolio</div>
              <div className="text-xl font-bold">+{benchmarkPerformance.portfolio.ytd.toFixed(2)}%</div>
            </div>
            <div className="border rounded-md p-3 transition-all duration-300 hover:shadow-md">
              <div className="text-sm text-muted-foreground">S&P 500</div>
              <div className="text-xl font-bold">+{benchmarkPerformance.sp500.ytd.toFixed(2)}%</div>
            </div>
            <div className="border rounded-md p-3 transition-all duration-300 hover:shadow-md">
              <div className="text-sm text-muted-foreground">NASDAQ</div>
              <div className="text-xl font-bold">+{benchmarkPerformance.nasdaq.ytd.toFixed(2)}%</div>
            </div>
            <div className="border rounded-md p-3 transition-all duration-300 hover:shadow-md">
              <div className="text-sm text-muted-foreground">Dow Jones</div>
              <div className="text-xl font-bold">+{benchmarkPerformance.dow.ytd.toFixed(2)}%</div>
            </div>
          </>
        ) : (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border rounded-md p-3 transition-all duration-300 hover:shadow-md">
              <div className="h-4 w-24 bg-muted/50 animate-pulse rounded mb-2"></div>
              <div className="h-6 w-16 bg-muted/50 animate-pulse rounded"></div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


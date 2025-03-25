"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Sample data
const sectorData = [
  { name: "Technology", value: 45.2, color: "#8884d8" },
  { name: "Healthcare", value: 15.8, color: "#82ca9d" },
  { name: "Consumer Cyclical", value: 12.5, color: "#ffc658" },
  { name: "Financial Services", value: 10.3, color: "#ff8042" },
  { name: "Communication Services", value: 8.7, color: "#0088fe" },
  { name: "Consumer Defensive", value: 4.2, color: "#00C49F" },
  { name: "Industrials", value: 3.3, color: "#FFBB28" },
]

const assetClassData = [
  { name: "Stocks", value: 75.5, color: "#8884d8" },
  { name: "Bonds", value: 15.2, color: "#82ca9d" },
  { name: "Cash", value: 5.8, color: "#ffc658" },
  { name: "Alternatives", value: 3.5, color: "#ff8042" },
]

const geographyData = [
  { name: "United States", value: 68.3, color: "#8884d8" },
  { name: "Europe", value: 12.7, color: "#82ca9d" },
  { name: "Asia Pacific", value: 10.5, color: "#ffc658" },
  { name: "Emerging Markets", value: 6.2, color: "#ff8042" },
  { name: "Other", value: 2.3, color: "#0088fe" },
]

export default function PortfolioAllocation() {
  return (
    <Tabs defaultValue="sector" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="sector">By Sector</TabsTrigger>
        <TabsTrigger value="assetClass">By Asset Class</TabsTrigger>
        <TabsTrigger value="geography">By Geography</TabsTrigger>
      </TabsList>

      <TabsContent value="sector">
        <AllocationChart data={sectorData} title="Sector Allocation" />
      </TabsContent>

      <TabsContent value="assetClass">
        <AllocationChart data={assetClassData} title="Asset Class Allocation" />
      </TabsContent>

      <TabsContent value="geography">
        <AllocationChart data={geographyData} title="Geographic Allocation" />
      </TabsContent>
    </Tabs>
  )
}

interface AllocationChartProps {
  data: {
    name: string
    value: number
    color: string
  }[]
  title: string
}

function AllocationChart({ data, title }: AllocationChartProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xl font-bold mb-4">{title}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Allocation"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PortfolioPerformanceChart from "@/components/portfolio-performance-chart"
import PerformanceMetrics from "@/components/performance-metrics"
import PerformanceComparison from "@/components/performance-comparison"

export default function PerformancePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Performance</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <PerformanceMetrics />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Benchmark Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="border transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Historical performance of your investments</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <PortfolioPerformanceChart detailed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card className="border transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Benchmark Comparison</CardTitle>
              <CardDescription>Compare your portfolio against market indices</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceComparison />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


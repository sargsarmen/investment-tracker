import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PortfolioHoldings from "@/components/portfolio-holdings"

export default function PortfolioPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Portfolio</h1>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Holdings</CardTitle>
          <CardDescription>Your current investment holdings</CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioHoldings />
        </CardContent>
      </Card>
    </div>
  )
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import WatchlistTable from "@/components/watchlist-table"

export default function WatchlistPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Watchlist</h1>

      <Card>
        <CardHeader>
          <CardTitle>Stock Watchlist</CardTitle>
          <CardDescription>Track stocks you're interested in</CardDescription>
        </CardHeader>
        <CardContent>
          <WatchlistTable />
        </CardContent>
      </Card>
    </div>
  )
}


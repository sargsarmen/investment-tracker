"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWatchlist } from "@/context/watchlist-context"

export default function WatchlistSummary() {
  const { items, isLoading } = useWatchlist()
  const router = useRouter()

  // Show only the first 5 items in the summary
  const displayItems = items.slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Watchlist</h3>
        <Button size="sm" variant="outline" onClick={() => router.push("/watchlist")}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={4} className="h-12 animate-pulse bg-muted/50"></TableCell>
                </TableRow>
              ))
            ) : displayItems.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={4} className="h-16 text-center">
                  No items in watchlist
                </TableCell>
              </TableRow>
            ) : (
              // Populated state
              displayItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.symbol}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      {item.changePercent > 0 ? (
                        <Badge className="bg-green-500">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          {item.changePercent.toFixed(2)}%
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500">
                          <ArrowDown className="h-3 w-3 mr-1" />
                          {Math.abs(item.changePercent).toFixed(2)}%
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center">
        <Button variant="link" size="sm" onClick={() => router.push("/watchlist")}>
          View Full Watchlist
        </Button>
      </div>
    </div>
  )
}


"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp, Plus } from "lucide-react"

const transactions = [
  {
    id: "1",
    date: "2023-12-15",
    symbol: "AAPL",
    type: "buy",
    shares: 5,
    price: 194.68,
    total: 973.4,
  },
  {
    id: "2",
    date: "2023-12-10",
    symbol: "MSFT",
    type: "buy",
    shares: 3,
    price: 374.51,
    total: 1123.53,
  },
  {
    id: "3",
    date: "2023-12-05",
    symbol: "GOOGL",
    type: "sell",
    shares: 2,
    price: 133.32,
    total: 266.64,
  },
  {
    id: "4",
    date: "2023-11-28",
    symbol: "AMZN",
    type: "buy",
    shares: 10,
    price: 147.03,
    total: 1470.3,
  },
  {
    id: "5",
    date: "2023-11-20",
    symbol: "TSLA",
    type: "buy",
    shares: 8,
    price: 234.3,
    total: 1874.4,
  },
]

export default function RecentTransactions() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Activity</h3>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell className="font-medium">{transaction.symbol}</TableCell>
                <TableCell>
                  {transaction.type === "buy" ? (
                    <Badge className="bg-green-500">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      Buy
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      Sell
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">{transaction.shares}</TableCell>
                <TableCell className="text-right">${transaction.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">${transaction.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center">
        <Button variant="link" size="sm">
          View All Transactions
        </Button>
      </div>
    </div>
  )
}


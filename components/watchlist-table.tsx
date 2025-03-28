"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Edit, MoreHorizontal, Plus, Search, Trash } from "lucide-react"
import AddWatchlistItemModal from "./add-watchlist-item-modal"
import ConfirmDialog from "./confirm-dialog"
import { useWatchlist } from "@/context/watchlist-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent } from "@/components/ui/card"

export default function WatchlistTable() {
  const { items, isLoading, removeItem } = useWatchlist()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [itemToRemove, setItemToRemove] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const filteredItems = items.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditItem = (item: any) => {
    setEditingItem(item)
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search watchlist..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add to Watchlist
        </Button>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {isLoading ? (
            // Loading state
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={`loading-${index}`} className="animate-pulse">
                <CardContent className="p-4 h-32"></CardContent>
              </Card>
            ))
          ) : filteredItems.length === 0 ? (
            // Empty state
            <Card>
              <CardContent className="p-6 text-center">
                <p>No items found. Add your first item to get started.</p>
              </CardContent>
            </Card>
          ) : (
            // Populated state - mobile cards
            filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold">{item.symbol}</h3>
                      <p className="text-sm text-muted-foreground">{item.name}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditItem(item)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Item
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => setItemToRemove(item.id)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p>${item.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">P/E Ratio</p>
                      <p>{item.peRatio}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Market Cap</p>
                      <p>{item.marketCap}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Dividend</p>
                      <p>{item.dividendYield > 0 ? `${(item.dividendYield * 100).toFixed(2)}%` : "-"}</p>
                    </div>
                  </div>

                  <div className="flex justify-end items-center mt-3">
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
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        // Desktop table view
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">P/E</TableHead>
                <TableHead className="text-right">Market Cap</TableHead>
                <TableHead className="text-right">Dividend</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell colSpan={8} className="h-12 animate-pulse bg-muted/50"></TableCell>
                  </TableRow>
                ))
              ) : filteredItems.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No items found. Add your first item to get started.
                  </TableCell>
                </TableRow>
              ) : (
                // Populated state
                filteredItems.map((item) => (
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
                    <TableCell className="text-right">{item.peRatio}</TableCell>
                    <TableCell className="text-right">{item.marketCap}</TableCell>
                    <TableCell className="text-right">
                      {item.dividendYield > 0 ? `${(item.dividendYield * 100).toFixed(2)}%` : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditItem(item)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => setItemToRemove(item.id)}>
                            <Trash className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <AddWatchlistItemModal isOpen={isAddModalOpen} onClose={closeAddModal} editItem={editingItem} />

      <ConfirmDialog
        isOpen={!!itemToRemove}
        onClose={() => setItemToRemove(null)}
        onConfirm={() => {
          if (itemToRemove) {
            removeItem(itemToRemove)
            setItemToRemove(null)
          }
        }}
        title="Remove from Watchlist"
        description="Are you sure you want to remove this item from your watchlist? You can undo this action if needed."
      />
    </div>
  )
}


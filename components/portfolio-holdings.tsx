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
import { ArrowDown, ArrowUp, Edit, MoreHorizontal, Plus, RefreshCw, Search, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import AddPositionModal from "./add-position-modal"
import ConfirmDialog from "./confirm-dialog"
import { usePortfolio } from "@/context/portfolio-context"
import { Card, CardContent } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"

export default function PortfolioHoldings() {
  const { holdings, isLoading, isRefreshing, addPosition, updatePosition, removePosition, refreshPortfolio } =
    usePortfolio()

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingPosition, setEditingPosition] = useState<any | null>(null)
  const [positionToRemove, setPositionToRemove] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const filteredHoldings = holdings.filter(
    (holding) =>
      holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holding.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditPosition = (position: any) => {
    setEditingPosition(position)
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setEditingPosition(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search holdings..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={refreshPortfolio}
            disabled={isRefreshing}
            title="Refresh prices"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh prices</span>
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" />
            Add Position
          </Button>
        </div>
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
          ) : filteredHoldings.length === 0 ? (
            // Empty state
            <Card>
              <CardContent className="p-6 text-center">
                <p>No positions found. Add your first position to get started.</p>
              </CardContent>
            </Card>
          ) : (
            // Populated state - mobile cards
            filteredHoldings.map((holding) => (
              <Card key={holding.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold">{holding.symbol}</h3>
                      <p className="text-sm text-muted-foreground">{holding.name}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditPosition(holding)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Position
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => setPositionToRemove(holding.id)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Shares</p>
                      <p>{holding.shares}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Cost</p>
                      <p>${holding.avgCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Price</p>
                      <p>${holding.currentPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Value</p>
                      <p>${holding.value.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Allocation</p>
                      <p className="font-medium">{holding.allocation.toFixed(2)}%</p>
                    </div>
                    <div>
                      {holding.gain > 0 ? (
                        <Badge className="bg-green-500">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          {holding.gainPercent.toFixed(2)}%
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500">
                          <ArrowDown className="h-3 w-3 mr-1" />
                          {Math.abs(holding.gainPercent).toFixed(2)}%
                        </Badge>
                      )}
                    </div>
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
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Avg Cost</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell colSpan={9} className="h-12 animate-pulse bg-muted/50"></TableCell>
                  </TableRow>
                ))
              ) : filteredHoldings.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No positions found. Add your first position to get started.
                  </TableCell>
                </TableRow>
              ) : (
                // Populated state
                filteredHoldings.map((holding) => (
                  <TableRow key={holding.id}>
                    <TableCell className="font-medium">{holding.symbol}</TableCell>
                    <TableCell>{holding.name}</TableCell>
                    <TableCell className="text-right">{holding.shares}</TableCell>
                    <TableCell className="text-right">${holding.avgCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${holding.currentPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${holding.value.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {holding.gain > 0 ? (
                          <Badge className="bg-green-500">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            {holding.gainPercent.toFixed(2)}%
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            {Math.abs(holding.gainPercent).toFixed(2)}%
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{holding.allocation.toFixed(2)}%</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditPosition(holding)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Position
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => setPositionToRemove(holding.id)}>
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

      <AddPositionModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAddPosition={addPosition}
        editPosition={editingPosition}
        onUpdatePosition={updatePosition}
      />

      <ConfirmDialog
        isOpen={!!positionToRemove}
        onClose={() => setPositionToRemove(null)}
        onConfirm={() => {
          if (positionToRemove) {
            removePosition(positionToRemove)
            setPositionToRemove(null)
          }
        }}
        title="Remove Position"
        description="Are you sure you want to remove this position from your portfolio? You can undo this action if needed."
      />
    </div>
  )
}


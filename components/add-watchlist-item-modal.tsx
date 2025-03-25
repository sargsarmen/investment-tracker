"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { searchSP500Companies, getCompanyDetails } from "@/lib/api-service"
import { useWatchlist, type WatchlistItem } from "@/context/watchlist-context"
import { useIsMobile } from "@/hooks/use-mobile"

const formSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  name: z.string().min(1, "Company name is required"),
  price: z.string().min(1, "Current price is required"),
  change: z.string(),
  changePercent: z.string(),
})

interface AddWatchlistItemModalProps {
  isOpen: boolean
  onClose: () => void
  editItem?: WatchlistItem | null
}

export default function AddWatchlistItemModal({ isOpen, onClose, editItem = null }: AddWatchlistItemModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [symbolOptions, setSymbolOptions] = useState<ComboboxOption[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()
  const { addItem, updateItem } = useWatchlist()
  const isEditing = !!editItem
  const isMobile = useIsMobile()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      name: "",
      price: "",
      change: "0",
      changePercent: "0",
    },
  })

  // Update form values when editing an item
  useEffect(() => {
    if (isEditing && editItem) {
      form.reset({
        symbol: editItem.symbol,
        name: editItem.name,
        price: editItem.price.toString(),
        change: editItem.change.toString(),
        changePercent: editItem.changePercent.toString(),
      })
    } else {
      form.reset({
        symbol: "",
        name: "",
        price: "",
        change: "0",
        changePercent: "0",
      })
    }
  }, [form, editItem, isEditing, isOpen])

  // Load initial options
  useEffect(() => {
    if (isOpen && !isEditing) {
      loadCompanies("", 1, true)
    }
  }, [isOpen, isEditing])

  const loadCompanies = async (query: string, pageNum: number, reset = false) => {
    setIsSearching(true)
    try {
      const result = await searchSP500Companies(query, pageNum)

      const options = result.companies.map((company) => ({
        value: company.symbol,
        label: `${company.symbol} - ${company.name}`,
      }))

      if (reset) {
        setSymbolOptions(options)
      } else {
        setSymbolOptions((prev) => [...prev, ...options])
      }

      setHasMore(result.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error("Error loading companies:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    loadCompanies(query, 1, true)
  }

  const handleLoadMore = () => {
    if (hasMore && !isSearching) {
      loadCompanies(searchQuery, page + 1)
    }
  }

  const handleSymbolChange = async (symbol: string) => {
    form.setValue("symbol", symbol)

    if (!symbol) {
      // Clear other fields if no symbol is selected
      form.setValue("name", "")
      form.setValue("price", "")
      form.setValue("change", "0")
      form.setValue("changePercent", "0")
      return
    }

    try {
      setIsLoading(true)
      const details = await getCompanyDetails(symbol)
      if (details) {
        form.setValue("name", details.name)
        form.setValue("price", details.price.toString())
        form.setValue("change", details.change.toString())
        form.setValue("changePercent", details.changePercent.toString())
      }
    } catch (error) {
      console.error("Error fetching company details:", error)
      toast({
        title: "Error",
        description: "Failed to fetch company details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // Parse values
    const price = Number.parseFloat(values.price)
    const change = Number.parseFloat(values.change || "0")
    const changePercent = Number.parseFloat(values.changePercent || "0")

    // Create watchlist item object
    const itemData: WatchlistItem = {
      id: isEditing ? editItem!.id : Date.now().toString(),
      symbol: values.symbol.toUpperCase(),
      name: values.name,
      price,
      change,
      changePercent,
      peRatio: isEditing ? editItem?.peRatio : Math.round(Math.random() * 40 + 10),
      marketCap: isEditing ? editItem?.marketCap : `${Math.round(Math.random() * 1000)}B`,
      volume: isEditing ? editItem?.volume : `${Math.round(Math.random() * 50)}M`,
      avgVolume: isEditing ? editItem?.avgVolume : `${Math.round(Math.random() * 60)}M`,
      dividend: isEditing ? editItem?.dividend : Math.random() > 0.5 ? Number((Math.random() * 5).toFixed(2)) : 0,
      dividendYield: isEditing
        ? editItem?.dividendYield
        : Math.random() > 0.5
          ? Number((Math.random() * 0.05).toFixed(2))
          : 0,
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      if (isEditing) {
        updateItem(itemData)
        toast({
          title: "Watchlist item updated",
          description: `Updated ${values.symbol.toUpperCase()} in your watchlist.`,
        })
      } else {
        addItem(itemData)
        toast({
          title: "Watchlist item added",
          description: `Added ${values.symbol.toUpperCase()} to your watchlist.`,
        })
      }

      form.reset()
      onClose()
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? "w-[95vw] max-w-[95vw] p-4" : "sm:max-w-[425px]"}`}>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Watchlist Item" : "Add to Watchlist"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of the stock you're watching."
              : "Enter the details of the stock you want to track."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Input disabled {...field} />
                    ) : (
                      <Combobox
                        options={symbolOptions}
                        value={field.value}
                        onValueChange={handleSymbolChange}
                        placeholder="Select or search for a symbol"
                        emptyMessage="No symbols found"
                        loadingMessage="Loading symbols..."
                        isLoading={isSearching}
                        onSearch={handleSearch}
                        onScrollEnd={handleLoadMore}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Apple Inc." {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Price</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="any" placeholder="$ per share" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="change"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Change</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="$ change" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="changePercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Change %</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="% change" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
              <Button type="button" variant="outline" onClick={onClose} className={isMobile ? "w-full" : ""}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className={isMobile ? "w-full" : ""}>
                {isLoading ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update Item" : "Add to Watchlist"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


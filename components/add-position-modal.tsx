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
import { toast } from "sonner"
import { fetchStockPrices } from "@/lib/api-service"

// Define the schema with proper validation
const formSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").max(5, "Symbol too long"),
  name: z.string().min(1, "Company name is required"),
  shares: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({
        required_error: "Number of shares is required",
        invalid_type_error: "Shares must be a number",
      })
      .positive("Shares must be greater than 0"),
  ),
  avgCost: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({
        required_error: "Average cost is required",
        invalid_type_error: "Average cost must be a number",
      })
      .positive("Average cost must be greater than 0"),
  ),
})

// Type for the form values
type FormValues = z.infer<typeof formSchema>

interface Position {
  id: string
  symbol: string
  name: string
  shares: number
  avgCost: number
  currentPrice: number
  value: number
  gain: number
  gainPercent: number
  allocation: number
}

interface AddPositionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddPosition: (position: Position) => void
  editPosition?: Position | null
  onUpdatePosition?: (position: Position) => void
}

export default function AddPositionModal({
  isOpen,
  onClose,
  onAddPosition,
  editPosition = null,
  onUpdatePosition,
}: AddPositionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!editPosition

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      name: "",
      shares: undefined,
      avgCost: undefined,
    },
  })

  // Update form values when editing a position
  useEffect(() => {
    if (isEditing && editPosition) {
      form.reset({
        symbol: editPosition.symbol,
        name: editPosition.name,
        shares: editPosition.shares,
        avgCost: editPosition.avgCost,
      })
    } else {
      form.reset({
        symbol: "",
        name: "",
        shares: undefined,
        avgCost: undefined,
      })
    }
  }, [form, editPosition, isEditing])

  async function onSubmit(values: FormValues) {
    setIsLoading(true)

    try {
      // Parse form values
      const symbol = values.symbol.toUpperCase()
      const shares = values.shares
      const avgCost = values.avgCost

      // Fetch current price from API
      const prices = await fetchStockPrices([symbol])
      const currentPrice = prices[symbol]

      // Calculate derived values
      const value = shares * currentPrice
      const gain = shares * (currentPrice - avgCost)
      const gainPercent = ((currentPrice - avgCost) / avgCost) * 100

      // Create position object
      const positionData = {
        id: isEditing ? editPosition!.id : Date.now().toString(),
        symbol,
        name: values.name,
        shares,
        avgCost,
        currentPrice,
        value,
        gain,
        gainPercent,
        allocation: isEditing ? editPosition!.allocation : 0, // This will be recalculated
      }

      if (isEditing && onUpdatePosition) {
        onUpdatePosition(positionData)
        toast.success(`Updated ${shares} shares of ${symbol}`, {
          description: `Current price: $${currentPrice.toFixed(2)}`,
        })
      } else {
        onAddPosition(positionData)
        toast.success(`Added ${shares} shares of ${symbol}`, {
          description: `Current price: $${currentPrice.toFixed(2)}`,
        })
      }

      form.reset()
      onClose()
    } catch (error) {
      toast.error("Failed to process position", {
        description: "There was an error fetching the current price. Please try again.",
      })
      console.error("Error processing position:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Position" : "Add New Position"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your investment position."
              : "Enter the details of your investment position."}
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
                    <Input placeholder="e.g. AAPL" {...field} />
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
                    <Input placeholder="e.g. Apple Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shares"
                render={({ field: { onChange, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Shares</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Number of shares"
                        onChange={(e) => {
                          const value = e.target.value
                          onChange(value)
                        }}
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avgCost"
                render={({ field: { onChange, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Average Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="$ per share"
                        onChange={(e) => {
                          const value = e.target.value
                          onChange(value)
                        }}
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update Position" : "Add Position"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


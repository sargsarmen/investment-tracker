"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type ComboboxOption = {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  loadingMessage?: string
  isLoading?: boolean
  onSearch?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  onScrollEnd?: () => void
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  loadingMessage = "Loading...",
  isLoading = false,
  onSearch,
  onOpenChange,
  onScrollEnd,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const commandRef = React.useRef<HTMLDivElement>(null)

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    onOpenChange?.(open)
    if (!open) {
      setSearchQuery("")
    }
  }

  const handleSearch = (search: string) => {
    setSearchQuery(search)
    onSearch?.(search)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!onScrollEnd) return

    const target = e.target as HTMLDivElement
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50

    if (isAtBottom && !isLoading) {
      onScrollEnd()
    }
  }

  const selectedOption = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value && selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search..." value={searchQuery} onValueChange={handleSearch} />
          <CommandList ref={commandRef} onScroll={handleScroll}>
            {isLoading && <CommandLoading>{loadingMessage}</CommandLoading>}
            {options.length === 0 && !isLoading && <CommandEmpty>{emptyMessage}</CommandEmpty>}
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onValueChange(option.value)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent >
    </Popover >
  )
}


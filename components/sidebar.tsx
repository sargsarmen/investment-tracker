"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { LineChart, List, PieChart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

const routes = [
  {
    label: "Portfolio",
    icon: PieChart,
    href: "/",
    color: "text-violet-500",
  },
  {
    label: "Watchlist",
    icon: List,
    href: "/watchlist",
    color: "text-orange-500",
  },
  {
    label: "Performance",
    icon: LineChart,
    href: "/performance",
    color: "text-blue-500",
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  // Close the mobile menu when route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const navigationLinks = (
    <div className="space-y-1">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center text-sm group py-3 px-3 rounded-md hover:bg-accent",
            pathname === route.href ? "bg-gray-200" : "transparent",
          )}
        >
          <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
          {route.label}
        </Link>
      ))}
    </div>
  )

  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-background border-b">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold">Investment Tracker</h1>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
              <div className="flex flex-col h-full py-6">
                <div className="px-6 mb-6">
                  <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
                    <h1 className="text-xl font-bold">Investment Tracker</h1>
                  </Link>
                </div>
                <div className="px-3">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center text-sm group py-3 px-3 rounded-md hover:bg-accent",
                        pathname === route.href ? "bg-accent" : "transparent",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                      {route.label}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="h-16" /> {/* Spacer for fixed header */}
      </>
    )
  }

  return (
    <div className="flex flex-col h-full space-y-4 py-4 bg-muted/40 border-r">
      <div className="px-3 py-2">
        <Link href="/" className="flex items-center pl-3 mb-6">
          <h1 className="text-xl font-bold">Investment Tracker</h1>
        </Link>
        {navigationLinks}
      </div>
    </div>
  )
}


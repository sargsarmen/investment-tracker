"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LineChart, List, PieChart } from "lucide-react"

const routes = [
  {
    label: "Portfolio",
    icon: PieChart,
    href: "/portfolio",
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

  return (
    <div className="flex flex-col h-full space-y-4 py-4 bg-muted/40 border-r">
      <div className="px-3 py-2">
        <Link href="/portfolio" className="flex items-center pl-3 mb-6">
          <h1 className="text-xl font-bold">Investment Tracker</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center text-sm group py-2 px-3 rounded-md hover:bg-accent",
                pathname === route.href ? "bg-accent" : "transparent",
              )}
            >
              <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import { SonnerProvider } from "@/components/sonner-provider"
import { PortfolioProvider } from "@/context/portfolio-context"
import { WatchlistProvider } from "@/context/watchlist-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Investment Tracker",
  description: "Track and analyze your personal investments",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
          <PortfolioProvider>
            <WatchlistProvider>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
                </div>
              </div>
              <SonnerProvider />
            </WatchlistProvider>
          </PortfolioProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
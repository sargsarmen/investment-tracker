import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Sidebar from "@/components/sidebar"
import { Toaster as SonnerToaster } from "sonner"
import { PortfolioProvider } from "@/context/portfolio-context"
import { WatchlistProvider } from "@/context/watchlist-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Investment Tracker",
  description: "Track and analyze your personal investments",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
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
        <PortfolioProvider>
          <WatchlistProvider>
            <div className="flex flex-col md:flex-row h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
              </div>
            </div>
            <SonnerToaster
              position="bottom-right"
              toastOptions={{
                duration: 5000,
                className: "sonner-toast",
                descriptionClassName: "sonner-description",
              }}
            />
          </WatchlistProvider>
        </PortfolioProvider>
      </body>
    </html>
  )
}
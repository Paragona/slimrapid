import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Destinopia - Your Ultimate Travel Companion",
  description: "Discover and plan your perfect travel destinations with Destinopia",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased flex flex-col overflow-x-hidden", inter.className)}>
        <TooltipProvider>
        <Header />
        <main className="flex-1 overflow-y-auto pl-16 md:pl-48 lg:pl-64">
          {children}
        </main>
        <Footer />
        </TooltipProvider>
      </body>
    </html>
  )
}

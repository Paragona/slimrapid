import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { cn } from "@/lib/utils"
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
      <body className={cn("min-h-screen bg-background antialiased flex flex-col pt-16 overflow-x-hidden", inter.className)}>
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/auth/AuthContext"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Sidebar from "@/components/Sidebar"

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
  const isAuthPage = children?.toString().includes('(auth)')

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased flex flex-col overflow-x-hidden", inter.className)}>
        <AuthProvider>
          <TooltipProvider>
            {!isAuthPage && <Header />}
            <div className="flex flex-1">
              {!isAuthPage && <Sidebar />}
              <main className={cn("flex-1 overflow-y-auto", {
                "w-[calc(100%-4rem)] md:w-[calc(100%-12rem)] lg:w-[calc(100%-16rem)] ml-16 md:ml-48 lg:ml-64": !isAuthPage,
                "w-full": isAuthPage
              })}>
                {children}
              </main>
            </div>
            {!isAuthPage && <Footer />}
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

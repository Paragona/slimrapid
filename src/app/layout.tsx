import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/auth/AuthContext"
import { Sidebar } from "@/components/layout"
import { Footer } from "@/components/layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Destinopia",
  description: "Your next destination awaits",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased", inter.className)}>
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen relative">
              <Sidebar />
              <main className="relative min-h-screen pl-[250px] pt-6 pr-6">{children}</main>
              <Footer />
            </div>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

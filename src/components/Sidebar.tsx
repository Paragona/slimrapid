"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Home,
  User,
  Settings,
  Map,
  Calculator,
  LogOut
} from "lucide-react"
import { useAuth } from "@/auth/AuthContext"

const sidebarLinks = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/map", icon: Map, label: "Map" },
  { href: "/calculator", icon: Calculator, label: "Calculator" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 md:w-48 lg:w-64 bg-background border-r">
      <div className="flex h-full flex-col justify-between py-4">
        <nav className="space-y-2 px-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline-block">{link.label}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="px-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline-block">Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}

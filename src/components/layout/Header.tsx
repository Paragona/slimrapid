"use client"
import Link from "next/link"
import { MapPin, LogIn, LogOut, User } from "lucide-react"
import { mainNavLinks } from "@/config/navigation"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/auth/AuthContext"
import { type ReactElement } from "react"

interface NavItem {
  href: string
  icon: ReactElement
  label: string
  onClick?: () => void
}

export default function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const isLoggedIn = !!user

  const isActive = (path: string) => {
    if (path === '/') return pathname === path
    return pathname.startsWith(path) || pathname === path
  }

  const authNavItems: NavItem[] = isLoggedIn
    ? [
        { href: '/profile', icon: <User className="w-4 h-4" />, label: 'Profile' },
        { href: '#', icon: <LogOut className="w-4 h-4" />, label: 'Logout', onClick: logout }
      ]
    : [
        { href: '/login', icon: <LogIn className="w-4 h-4" />, label: 'Login' }
      ]

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    if (item.onClick) {
      return (
        <button
          onClick={item.onClick}
          className={cn(
            "flex items-center gap-2 px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors",
            { "text-blue-600": isActive(item.href) }
          )}
        >
          <div className="flex items-center justify-center">
            {item.icon}
          </div>
          <span className="text-sm font-medium md:inline hidden">
            {item.label}
          </span>
        </button>
      )
    }

    return (
      <Link 
        href={item.href} 
          className={cn(
            "flex items-center gap-2 px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors",
            { "text-blue-600": isActive(item.href) }
          )}
        >
          <div className="flex items-center justify-center">
            {item.icon}
          </div>
          <span className="text-sm font-medium md:inline hidden">
          {item.label}
        </span>
      </Link>
    )
  }

  return (
    <header className="fixed top-0 left-0 w-full h-12 bg-white shadow-sm z-50 flex items-center px-4 justify-between">
      <Link href="/" className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-gray-700 hover:scale-110 transition-transform" />
        <span className="text-lg font-bold text-gray-800">
          RapidMove24
        </span>
      </Link>

      {/* Main Navigation - Center */}
      <nav className="flex-1 flex items-center justify-center px-4">
        <ul className="flex items-center gap-6">
          {mainNavLinks.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={cn(
                  "flex items-center gap-2 px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors",
                  { "text-blue-600": isActive(item.href) }
                )}
              >
                <div className="flex items-center justify-center">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium md:inline hidden">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Auth Navigation - Right */}
      <nav className="px-4">
        <ul className="flex items-center gap-4">
          {authNavItems.map((item) => (
            <li key={item.href}>
              <NavItemComponent item={item} />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

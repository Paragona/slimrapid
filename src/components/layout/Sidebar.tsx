"use client"

import * as React from "react"
import { useAuth } from "@/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { NavLink } from "@/components/navigation/nav-link"
import { mainNavLinks, settingsLinks } from "@/config/navigation"
import { MapPin, LogIn, LogOut } from "lucide-react"
import Link from "next/link"
import { styles } from "@/config/styles"
import cn from "classnames"
import { NavigationLink } from "@/types"

export default function Sidebar() {
  const { user, logout } = useAuth()
  const isLoggedIn = !!user

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-10 md:w-40 lg:w-52 bg-background border-r flex flex-col">
      <div className="flex-1 py-1 md:py-4">
        {/* Logo */}
        <div className="px-1 md:px-4 mb-1 md:mb-6">
          <Link href="/" className={cn(styles.nav.base, "hover:text-primary")}>
            <MapPin className={styles.nav.icon.logo} />
            <span className={styles.text.logo}>
              RapidMove24
            </span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className={styles.nav.container.base}>
          {mainNavLinks.map((link: NavigationLink) => (
            <NavLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              variant="sidebar"
            />
          ))}
        </nav>

        {/* Settings Navigation */}
        <nav className={styles.nav.container.settings}>
          {settingsLinks.map((link: NavigationLink) => (
            <NavLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              variant="sidebar"
            />
          ))}
        </nav>
      </div>

      {/* Auth Button */}
      <div className="p-1 md:p-4 border-t">
        <Button
          variant="ghost"
          className="w-full h-8 md:h-10 justify-start gap-1 md:gap-2 px-1 md:px-4"
          onClick={isLoggedIn ? logout : () => {}}
        >
          {isLoggedIn ? (
            <>
              <LogOut className={styles.nav.icon.base} />
              <span className="hidden md:inline">Logout</span>
            </>
          ) : (
            <>
              <LogIn className={styles.nav.icon.base} />
              <span className="hidden md:inline">Login</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}

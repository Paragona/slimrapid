"use client"
import Link from "next/link"
import { MapPin, LogIn, LogOut, User } from "lucide-react"
import { usePathname } from "next/navigation"
import styles from '@/styles/Header.module.css'
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
        { href: '/profile', icon: <User className={styles.icon} />, label: 'Profile' },
        { href: '#', icon: <LogOut className={styles.icon} />, label: 'Logout', onClick: logout }
      ]
    : [
        { href: '/login', icon: <LogIn className={styles.icon} />, label: 'Login' }
      ]

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    if (item.onClick) {
      return (
        <button
          onClick={item.onClick}
          className={cn(styles.navItem, {
            [styles.active]: isActive(item.href)
          })}
        >
          <div className={styles.iconWrapper}>
            {item.icon}
          </div>
          <span className={styles.label}>
            {item.label}
          </span>
        </button>
      )
    }

    return (
      <Link 
        href={item.href} 
        className={cn(styles.navItem, {
          [styles.active]: isActive(item.href)
        })}
      >
        <div className={styles.iconWrapper}>
          {item.icon}
        </div>
        <span className={styles.label}>
          {item.label}
        </span>
      </Link>
    )
  }

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <MapPin className={styles.logoIcon} />
        <span className={styles.logoText}>
          RapidMove24
        </span>
      </Link>

      {/* Auth Navigation - Right */}
      <nav className={styles.authNav}>
        <ul className={styles.navList}>
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

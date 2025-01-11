"use client"
import Link from "next/link"
import { MapPin, Home, Star, HelpCircle, Calculator, User, LogIn } from "lucide-react"
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

  const isActive = (path: string) => {
    if (path === '/') return pathname === path
    return pathname.startsWith(path) || pathname === path
  }

  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const mainNavItems: NavItem[] = [
    { href: '/', icon: <Home className={styles.icon} />, label: 'Home' },
    { href: '#features', icon: <Star className={styles.icon} />, label: 'Features' },
    { href: '#how-it-works', icon: <HelpCircle className={styles.icon} />, label: 'How It Works' },
    { href: '/calculator', icon: <Calculator className={styles.icon} />, label: 'Calculator' },
  ]

  const authNavItems: NavItem[] = isLoggedIn 
    ? [
        { 
          href: '/profile', 
          icon: <User className={styles.icon} />, 
          label: user.displayName || user.email || 'Profile',
          onClick: logout
        }
      ]
    : [
        { 
          href: '/login', 
          icon: <LogIn className={styles.icon} />, 
          label: 'Login'
        }
      ];

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
          Destinopia
        </span>
      </Link>
      
      {/* Main Navigation - Centered */}
      <nav className={styles.mainNav}>
        <ul className={styles.navList}>
          {mainNavItems.map((item) => (
            <li key={item.href}>
              <NavItemComponent item={item} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Auth Navigation - Bottom */}
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

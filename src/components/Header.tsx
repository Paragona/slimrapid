"use client"
import Link from "next/link"
import { MapPin, Home, Star, HelpCircle, Calculator, User, LogIn, UserPlus } from "lucide-react"
import { usePathname } from "next/navigation"
import styles from '@/styles/Header.module.css'
import { cn } from "@/lib/utils"

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === path
    return pathname.startsWith(path) || pathname === path
  }

  // Mock authentication state - replace with your actual auth logic
  const isLoggedIn = false;

  const mainNavItems = [
    { href: '/', icon: <Home className={styles.icon} />, label: 'Home' },
    { href: '#features', icon: <Star className={styles.icon} />, label: 'Features' },
    { href: '#how-it-works', icon: <HelpCircle className={styles.icon} />, label: 'How It Works' },
    { href: '/calculator', icon: <Calculator className={styles.icon} />, label: 'Calculator' },
  ]

  const authNavItems = isLoggedIn 
    ? [{ href: '/profile', icon: <User className={styles.icon} />, label: 'Profile' }]
    : [
        { href: '/login', icon: <LogIn className={styles.icon} />, label: 'Login' },
        { href: '/register', icon: <UserPlus className={styles.icon} />, label: 'Register' }
      ];

  return (
    <header className={styles.header}
    >
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
            </li>
          ))}
        </ul>
      </nav>

      {/* Auth Navigation - Bottom */}
      <nav className={styles.authNav}>
        <ul className={styles.navList}>
          {authNavItems.map((item) => (
            <li key={item.href}>
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
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

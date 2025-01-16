"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { styles } from "@/config/styles"

interface NavLinkProps {
  href: string
  icon?: LucideIcon
  label: string
  className?: string
  showIcon?: boolean
  variant?: 'default' | 'sidebar'
}

export function NavLink({ 
  href, 
  icon: Icon, 
  label, 
  className,
  showIcon = true,
  variant = 'default'
}: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        styles.nav.base,
        styles.nav.link.base,
        isActive && styles.nav.link.active,
        variant === 'sidebar' && styles.nav.link.sidebar,
        className
      )}
    >
      {showIcon && Icon && <Icon className={styles.nav.icon.base} />}
      <span className="hidden md:inline">{label}</span>
    </Link>
  )
}

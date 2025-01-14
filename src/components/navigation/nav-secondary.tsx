import { NavigationLink } from '@/types'
import { NavLink } from '@/components/ui/nav-link'
import { cn } from '@/lib/utils'

interface NavSecondaryProps {
  items: NavigationLink[]
  className?: string
}

export function NavSecondary({ items, className }: NavSecondaryProps) {
  return (
    <nav className={cn("space-y-1", className)}>
      {items.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
        />
      ))}
    </nav>
  )
}

import { NavigationLink } from '@/types'
import { NavLink } from '@/components/ui/nav-link'

interface NavMainProps {
  items: NavigationLink[]
}

export function NavMain({ items }: NavMainProps) {
  return (
    <nav className="space-y-1">
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

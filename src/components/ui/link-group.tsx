import { NavLink } from "./nav-link"
import { styles } from "@/config/styles"

interface LinkGroupProps {
  title: string
  links: Array<{
    href: string
    label: string
  }>
}

export function LinkGroup({ title, links }: LinkGroupProps) {
  return (
    <div className={styles.layout.spacing.base}>
      <h3 className={styles.text.title}>{title}</h3>
      <div className={`flex flex-col ${styles.layout.spacing.tight}`}>
        {links.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            showIcon={false}
          />
        ))}
      </div>
    </div>
  )
}

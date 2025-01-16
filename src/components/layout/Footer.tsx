import Link from "next/link"
import { footerLinks } from "@/config/navigation"
import { styles } from "@/config/styles"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <FooterSection title="Company" links={footerLinks.company} />
          <FooterSection title="Support" links={footerLinks.support} />
          <FooterSection title="Legal" links={footerLinks.legal} />
          <FooterSection title="Social" links={footerLinks.social} />
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          {new Date().getFullYear()} RapidMove24. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

function FooterSection({ title, links }: { title: string; links: Array<{ href: string; label: string; icon?: React.ComponentType }> }) {
  return (
    <div className="space-y-3">
      <h4 className={styles.text.title}>{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
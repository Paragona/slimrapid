import { 
  Home,
  Calculator,
  HelpCircle,
  Star,
  User,
  Info,
  Twitter,
  Github,
  Mail,
  Phone,
  Shield,
  FileText,
  Cookie
} from "lucide-react"
import { NavigationLink, FooterConfig } from "@/types"

export const mainNavLinks: NavigationLink[] = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/how-it-works", icon: HelpCircle, label: "How It Works" },
  { href: "/calculator", icon: Calculator, label: "Calculator" },
]

export const settingsLinks: NavigationLink[] = [
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/about", icon: Info, label: "About" },
]

export const footerLinks: FooterConfig = {
  company: [
    { href: "/about", label: "About Us", icon: Info },
    { href: "/blog", label: "Blog", icon: Star },
    { href: "/careers", label: "Careers", icon: User },
  ],
  support: [
    { href: "/help", label: "Help Center", icon: HelpCircle },
    { href: "/contact", label: "Contact", icon: Mail },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy", icon: Shield },
    { href: "/terms", label: "Terms of Service", icon: FileText },
    { href: "/cookies", label: "Cookie Policy", icon: Cookie },
  ],
  social: [
    { href: "https://twitter.com/rapidmove24", label: "Twitter", icon: Twitter },
    { href: "https://github.com/rapidmove24", label: "GitHub", icon: Github },
    { href: "tel:+1234567890", label: "Phone", icon: Phone },
  ]
}

import Link from "next/link"
import { MapPin } from "lucide-react"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <MapPin className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">Destinopia</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="#features" className="text-gray-600 hover:text-blue-600">Features</Link></li>
            <li><Link href="#how-it-works" className="text-gray-600 hover:text-blue-600">How It Works</Link></li>
            <li><Link href="#testimonials" className="text-gray-600 hover:text-blue-600">Testimonials</Link></li>
            <li><Link href="/calculator" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Get Started</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

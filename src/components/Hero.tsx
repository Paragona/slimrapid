import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-green-400 text-white py-20">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Calculate Your Move with Precision</h1>
          <p className="text-xl md:text-2xl mb-8">Plan your journey, estimate costs, and find the best route for your move.</p>
          <Link href="/calculator" className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300">
            Start Calculating
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <div className="lg:w-1/2 relative">
          <div className="w-full h-64 md:h-80 lg:h-96 relative overflow-hidden rounded-lg shadow-xl">
            <Image
              src="/moving-truck.svg"
              alt="Moving truck illustration"
              fill
              style={{ objectFit: "contain" }}
              className="animate-drive"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

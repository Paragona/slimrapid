import Hero from "@/components/Hero"
import Features from "@/components/Features"
import HowItWorks from "@/components/HowItWorks"
import Testimonials from "@/components/Testimonials"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col pt-16">
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
    </main>
  )
}

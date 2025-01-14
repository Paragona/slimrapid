import { Hero, Features, HowItWorks, Testimonials } from "@/components/home"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col" >
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
    </main>
  )
}

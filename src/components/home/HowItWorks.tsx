import { MapPin, Truck, Home } from "lucide-react"

const steps = [
  {
    icon: <MapPin className="h-12 w-12 text-blue-600" />,
    title: "Enter Locations",
    description: "Input your current location and destination to start the calculation process."
  },
  {
    icon: <Truck className="h-12 w-12 text-green-600" />,
    title: "Choose Services",
    description: "Select the type of moving services you need, including vehicle size and additional options."
  },
  {
    icon: <Home className="h-12 w-12 text-yellow-600" />,
    title: "Get Results",
    description: "Receive a detailed breakdown of distance, estimated costs, and recommended routes for your move."
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-start space-y-8 md:space-y-0 md:space-x-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-xs">
              <div className="mb-4 p-4 bg-white rounded-full shadow-lg">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

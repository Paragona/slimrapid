import { MapPin, DollarSign, Clock, TrendingUp } from "lucide-react"

const features = [
  {
    icon: <MapPin className="h-8 w-8 text-blue-600" />,
    title: "Accurate Distance Calculation",
    description: "Get precise distance measurements between your current location and destination."
  },
  {
    icon: <DollarSign className="h-8 w-8 text-green-600" />,
    title: "Cost Estimation",
    description: "Calculate estimated travel costs including transportation, accommodation, and activities."
  },
  {
    icon: <Clock className="h-8 w-8 text-purple-600" />,
    title: "Time Planning",
    description: "Plan your journey with accurate time estimates for travel and activities."
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
    title: "Smart Recommendations",
    description: "Get personalized travel recommendations based on your preferences and budget."
  }
]

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Destinopia?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

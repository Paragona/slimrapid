import Image from "next/image"

const testimonials = [
  {
    quote: "Destinopia's moving calculator made planning my cross-country move a breeze. Highly recommended!",
    author: "Sarah Johnson",
    role: "Happy Mover",
    avatar: "/placeholder.svg?height=64&width=64"
  },
  {
    quote: "I saved both time and money using this incredible tool. It's a must-have for anyone planning move.",
    author: "Michael Chen",
    role: "Satisfied Customer",
    avatar: "/placeholder.svg?height=64&width=64"
  },
  {
    quote: "The accuracy of the distance calculation and cost estimation was impressive. It helped me budget effectively.",
    author: "Emily Rodriguez",
    role: "Recent Mover",
    avatar: "/placeholder.svg?height=64&width=64"
  }
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  width={64}
                  height={64}
                  className="rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { z } from "zod"
import { useAuth } from "@/auth/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AddressInput } from "@/components/ui/address-input"
import Link from "next/link"

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string(),
  name: z.string().optional().nullable(),
  mobile: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional().nullable(),
  address: z.string().optional().nullable(),
  zipcode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid zipcode format").optional().nullable()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
    email: "",
    password: "",
    confirmPassword: "",
    name: null,
    mobile: null,
    address: null,
    zipcode: null
  })
  const [localError, setLocalError] = useState<string | null>(null)
  const { registerWithEmail, signInWithGoogle, error: authError } = useAuth()
  const router = useRouter()
  const [addressSuggestions] = useState<string[]>([]) // In a real app, this would be populated from an API

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    try {
      const validatedData = registerSchema.parse(form)

      await registerWithEmail(validatedData.email, validatedData.password, {
        name: validatedData.name || undefined,
        mobile: validatedData.mobile || undefined,
        address: validatedData.address || undefined,
        zipcode: validatedData.zipcode || undefined
      })
      if (!authError) {
        router.push("/")
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setLocalError(error.errors[0].message)
      } else {
        console.error("Registration error:", error)
        setLocalError("An error occurred during registration")
      }
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
              Confirm Password
            </label>
            <div className="mt-2">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="name">Name (Optional)</Label>
            <div className="mt-2">
              <Input
                id="name"
                name="name"
                type="text"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value || null })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="mobile">Mobile Number (Optional)</Label>
            <div className="mt-2">
              <Input
                id="mobile"
                name="mobile"
                type="tel"
                value={form.mobile || ""}
                onChange={(e) => setForm({ ...form, mobile: e.target.value || null })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address (Optional)</Label>
            <div className="mt-2">
              <AddressInput
                id="address"
                label="Address"
                value={form.address || ""}
                onChange={(value) => setForm({ ...form, address: value || null })}
                onSelect={(address) => setForm({ ...form, address: address || null })}
                suggestions={addressSuggestions}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="zipcode">Zipcode (Optional)</Label>
            <div className="mt-2">
              <Input
                id="zipcode"
                name="zipcode"
                type="text"
                value={form.zipcode || ""}
                onChange={(e) => setForm({ ...form, zipcode: e.target.value || null })}
              />
            </div>
          </div>

          {(localError || authError) && (
            <div className="text-red-500 text-sm mt-2">
              {localError || authError}
            </div>
          )}

          <div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <Button 
            onClick={() => signInWithGoogle()}
            variant="outline"
            className="w-full"
          >
            Sign up with Google
          </Button>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

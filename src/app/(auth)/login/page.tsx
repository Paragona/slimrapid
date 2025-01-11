"use client"

import * as React from "react"
import { useState } from "react"
import { useAuth } from "@/auth/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signInWithEmail, signInWithGoogle, error } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await signInWithEmail(email, password)
    if (!error) {
      router.push("/")
    }
  }

  const handleGoogleSignIn = async () => {
    await signInWithGoogle()
    if (!error) {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full"
            >
              Sign in with Google
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

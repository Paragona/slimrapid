"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/auth/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AddressInput } from "@/components/ui/address-input"
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import { z } from "zod"

const profileSchema = z.object({
  name: z.string().optional().nullable(),
  mobile: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional().nullable(),
  address: z.string().optional().nullable(),
  zipcode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid zipcode format").optional().nullable()
})

type UserProfile = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    name: null,
    mobile: null,
    address: null,
    zipcode: null
  })
  const [addressSuggestions] = useState<string[]>([]) // In a real app, this would be populated from an API

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Fetch user profile data from Firestore
    const fetchProfile = async () => {
      const db = getFirestore()
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        setProfile({
          name: data.name || null,
          mobile: data.mobile || null,
          address: data.address || null,
          zipcode: data.zipcode || null
        })
      }
    }

    fetchProfile()
  }, [user, router])

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const validatedData = profileSchema.parse(profile)
      
      const db = getFirestore()
      await setDoc(doc(db, "users", user.uid), {
        ...validatedData,
        email: user.email,
        updatedAt: new Date().toISOString()
      }, { merge: true })
      
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (error) {
      console.error("Error updating profile:", error)
      if (error instanceof z.ZodError) {
        setMessage({ type: 'error', text: error.errors[0].message })
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name || ""}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                value={profile.mobile || ""}
                onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <AddressInput
                id="address"
                label="Address"
                value={profile.address || ""}
                onChange={(value) => setProfile({ ...profile, address: value })}
                onSelect={(address) => setProfile({ ...profile, address })}
                suggestions={addressSuggestions}
              />
            </div>

            <div>
              <Label htmlFor="zipcode">Zipcode</Label>
              <Input
                id="zipcode"
                value={profile.zipcode || ""}
                onChange={(e) => setProfile({ ...profile, zipcode: e.target.value })}
                className="mt-1"
              />
            </div>

            {message && (
              <div className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </div>
            )}

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { 
  createToken, 
  verifyToken, 
  setTokenInStorage, 
  removeTokenFromStorage, 
  getTokenFromStorage 
} from "@/lib/jwt"

interface UserProfile {
  name?: string
  mobile?: string
  address?: string
  zipcode?: string
}

interface User {
  _id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  name?: string
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (email: string, password: string, profile?: UserProfile) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
  error: null
})

const isDevelopment = process.env.NODE_ENV === 'development'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDevelopment) {
      setUser({
        _id: 'dev-id',
        email: 'dev@example.com',
        name: 'Developer'
      })
      setLoading(false)
      return
    }

    const initAuth = async () => {
      try {
        const token = getTokenFromStorage()
        if (token) {
          const decoded = await verifyToken(token)
          if (decoded) {
            setUser({
              _id: decoded.uid,
              email: decoded.email,
              name: decoded.name
            })
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        removeTokenFromStorage()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    if (isDevelopment) {
      setUser({
        _id: 'dev-id',
        email: 'dev@example.com',
        name: 'Developer'
      })
      setLoading(false)
      return
    }

    try {
      setError(null)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login')
      }

      // The API route sets the cookie, so we just need to update the state
      const decodedToken = await verifyToken(data.token)
      if (!decodedToken || !decodedToken.sub) {
        throw new Error('Invalid token payload')
      }
      
      // Transform JWT payload into User object
      const user: User = {
        _id: decodedToken.sub, // using sub claim as _id
        email: decodedToken.email as string,
        name: decodedToken.name as string | undefined
      }
      setUser(user)
      setLoading(false)
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Failed to login')
      setLoading(false)
    }
  }

  const registerWithEmail = async (email: string, password: string, profile?: UserProfile) => {
    if (isDevelopment) {
      setUser({
        _id: 'dev-id',
        email: 'dev@example.com',
        name: 'Developer'
      })
      return
    }

    try {
      setError(null)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, ...profile }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error creating account')
      }

      const token = await createToken({
        uid: data.user._id,
        email: data.user.email,
        name: data.user.name
      })
      
      setTokenInStorage(token)
      setUser(data.user)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error registering")
      console.error("Error registering:", error)
    }
  }

  const logout = async () => {
    if (isDevelopment) {
      setUser(null)
      return
    }

    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      })
      removeTokenFromStorage()
      setUser(null)
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        registerWithEmail,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { 
  createToken, 
  verifyToken, 
  setTokenInStorage, 
  removeTokenFromStorage, 
  getTokenFromStorage 
} from "@/lib/jwt"
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { auth, googleProvider } from "@/lib/firebase"

interface UserProfile {
  name?: string
  mobile?: string
  address?: string
  zipcode?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (email: string, password: string, profile?: UserProfile) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
  error: null
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      const result = await signInWithPopup(auth, googleProvider)
      const token = await createToken({
        uid: result.user.uid,
        email: result.user.email!,
        name: result.user.displayName || undefined
      })
      setTokenInStorage(token)
    } catch (error) {
      setError("Error signing in with Google")
      console.error("Error signing in with Google:", error)
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null)
      const result = await signInWithEmailAndPassword(auth, email, password)
      const token = await createToken({
        uid: result.user.uid,
        email: result.user.email!,
        name: result.user.displayName || undefined
      })
      setTokenInStorage(token)
    } catch (error) {
      setError("Invalid email or password")
      console.error("Error signing in with email:", error)
    }
  }

  const registerWithEmail = async (email: string, password: string, profile?: UserProfile) => {
    try {
      setError(null)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // If profile data is provided, save it to Firestore
      if (profile && userCredential.user) {
        const { uid } = userCredential.user
        const db = getFirestore()
        await setDoc(doc(db, "users", uid), {
          ...profile,
          email,
          createdAt: new Date().toISOString()
        })
      }

      // Create and store JWT
      const token = await createToken({
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        name: profile?.name
      })
      setTokenInStorage(token)
    } catch (error) {
      setError("Error creating account")
      console.error("Error registering with email:", error)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      removeTokenFromStorage()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Check for existing token on mount
  useEffect(() => {
    const checkToken = async () => {
      const token = getTokenFromStorage()
      if (token) {
        const payload = await verifyToken(token)
        if (!payload) {
          removeTokenFromStorage()
        }
      }
    }
    checkToken()
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      signInWithEmail,
      registerWithEmail,
      logout,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

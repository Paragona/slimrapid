import { SignJWT, jwtVerify } from 'jose'
import Cookies from 'js-cookie'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const JWT_COOKIE_NAME = 'jwt'

export interface JWTPayload {
  [key: string]: string | undefined
  uid: string
  email: string
  name?: string
}

export async function createToken(payload: JWTPayload): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET)
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)
  return token
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  const secret = new TextEncoder().encode(JWT_SECRET)
  try {
    const { payload } = await jwtVerify(token, secret)
    if (typeof payload === 'object' && payload && 'uid' in payload && 'email' in payload) {
      // TypeScript does not narrow the type of payload here
      return {
        uid: String(payload.uid), // TypeScript throws an error here
        email: String(payload.email), // TypeScript throws an error here
        name: payload.name ? String(payload.name) : undefined // TypeScript throws an error here
      }
    }
    return null
  } catch {
    return null
  }
}

// Client-side cookie management
export function getTokenFromStorage(): string | null {
  return Cookies.get(JWT_COOKIE_NAME) || null
}

export function setTokenInStorage(token: string): void {
  // Set cookie with proper attributes for persistence
  Cookies.set(JWT_COOKIE_NAME, token, {
    expires: 7, // 7 days
    path: '/',
    secure: process.env.NODE_ENV === 'development',
    sameSite: 'lax'
  })
}

export function removeTokenFromStorage(): void {
  Cookies.remove(JWT_COOKIE_NAME, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
}

// Server-side cookie management
export function getServerSideToken(headers: Headers): string | null {
  const cookies = headers.get('cookie')
  if (!cookies) return null

  const cookieItems = cookies.split(';').map(cookie => cookie.trim())
  const jwtCookie = cookieItems.find(cookie => cookie.startsWith(`${JWT_COOKIE_NAME}=`))
  
  if (!jwtCookie) return null
  return jwtCookie.split('=')[1]
}

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
      return {
        uid: String(payload.uid),
        email: String(payload.email),
        name: payload.name ? String(payload.name) : undefined
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
  Cookies.set(JWT_COOKIE_NAME, token, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
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

  const cookieValue = cookies
    .split(';')
    .find(cookie => cookie.trim().startsWith(`${JWT_COOKIE_NAME}=`))
    ?.trim()
    .slice(JWT_COOKIE_NAME.length + 1)

  return cookieValue || null
}

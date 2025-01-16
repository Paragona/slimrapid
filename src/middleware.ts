import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, getServerSideToken } from './lib/jwt'
import { ProtectedRouteConfig } from './types/auth'

// Route configuration for authentication and protection
const routeConfig: ProtectedRouteConfig[] = [
  // Auth-only routes (redirect to home if authenticated)
  { path: '/login', requireAuth: false, redirectTo: '/' },
  { path: '/register', requireAuth: false, redirectTo: '/' },

  // Protected routes (redirect to login if not authenticated)
  { path: '/profile', requireAuth: false, redirectTo: '/login' },

]

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname
    const token = await getServerSideToken(request.headers)
    const isAuthenticated = token ? await verifyToken(token) : false

    // Find matching route configuration
    const matchedRoute = routeConfig.find(route => 
      path.startsWith(route.path) || path === route.path
    )

    if (matchedRoute) {
      // Handle protected routes
      if (matchedRoute.requireAuth && !isAuthenticated) {
        const loginUrl = new URL(matchedRoute.redirectTo || '/login', request.url)
        loginUrl.searchParams.set('from', path)
        return NextResponse.redirect(loginUrl)
      }

      // Handle auth-only routes
      if (!matchedRoute.requireAuth && isAuthenticated) {
        return NextResponse.redirect(new URL(matchedRoute.redirectTo || '/', request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to login for safety
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Update matcher configuration to include all protected routes
export const config = {
  matcher: [
    '/login',
    '/register',
    '/profile',
    '/calculator',
    '/dashboard',
    '/profile/:path*',
  ]
}

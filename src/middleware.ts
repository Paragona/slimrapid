import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, getServerSideToken } from './lib/jwt'

// List of paths that are only accessible to non-authenticated users
const authPaths = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = await getServerSideToken(request.headers)

  // Check if path is auth-only (login/register) and user is already authenticated
  if (authPaths.some(p => path.startsWith(p))) {
    if (token && await verifyToken(token)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register']
}

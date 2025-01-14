import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { compare } from 'bcryptjs'
import { createToken } from '@/lib/jwt'
import { JWT_COOKIE_NAME } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      console.error('Login attempt with missing credentials')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    const { db } = await connectToDatabase()
    console.log('Attempting login for email:', email)
    const user = await db.collection('users').findOne({ email })

    if (!user) {
      console.log('Login failed: User not found for email:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isValid = await compare(password, user.password)
    if (!isValid) {
      console.log('Login failed: Invalid password for email:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await createToken({
      uid: user._id.toString(),
      email: user.email,
      name: user.name
    })

    console.log('Login successful for email:', email)
    
    // Create response with cookie
    const response = NextResponse.json({ 
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    })

    // Set the cookie with proper attributes
    response.cookies.set(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

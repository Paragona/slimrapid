import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { hash } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password, ...profile } = await request.json()
    
    if (!email || !password) {
      console.error('Registration attempt with missing credentials')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('Registration attempt with invalid email format:', email)
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      console.error('Registration attempt with weak password')
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }
    
    const { db } = await connectToDatabase()
    console.log('Attempting registration for email:', email)
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      console.log('Registration failed: Email already exists:', email)
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)
    
    // Create user
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      ...profile,
      createdAt: new Date().toISOString()
    })

    const user = await db.collection('users').findOne(
      { _id: result.insertedId },
      { projection: { password: 0 } }
    )
    
    console.log('Registration successful for email:', email)
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

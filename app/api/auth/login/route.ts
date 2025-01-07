import { generateToken } from '@/lib/auth'
import { comparePassword } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'No account found with this email address' },
        { status: 401 }
      )
    }

    if (!user.password) {
      return NextResponse.json(
        { message: 'This account has no password set. Please reset your password.' },
        { status: 401 }
      )
    }

    if (!(await comparePassword(password, user.password))) {
      return NextResponse.json(
        { message: 'Incorrect password. Please try again.' },
        { status: 401 }
      )
    }

    const token = await generateToken(
      user.id,
      user.role || '',
      user.email || '', 
      user.name || '',  
      user.status || '',
      user.position || ''
    )
    
    cookies().set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7  // 7 days
    })

    return NextResponse.json({ token }, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
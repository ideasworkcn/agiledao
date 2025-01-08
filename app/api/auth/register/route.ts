import { hashPassword } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  try {
    const { email, password, name, position } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Check if this is the first user
    const userCount = await prisma.user.count()
    const role = userCount === 0 ? 'Scrum Master' : 'Team Member'

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || '',
        position: position || '',
        role: role,
        status: 'Active',
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
    })

    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      position: newUser.position,
      role: newUser.role,
      status: newUser.status
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

const publicPaths = new Set([
  '/login',
  '/register',
  '/',
  '/documentation',
  '/workspace', 
  '/unauthorized',
  '/worklog/user',
  '/api/(.*)', 
])


type Role = 'Team Member' | 'Scrum Master' | 'Product Owner'
type RoleAccess = Record<Role, string[]>

const roleAccess: RoleAccess = {
  'Team Member': ['/', '/workspace', '/dashboard', '/task', '/worklog/user', '/documentation'],
  'Scrum Master': ['/', '/workspace', '/dashboard', '/task', '/worklog/user', '/documentation','/product', '/sprint', '/team', '/userstory', '/backlog', '/worklog/admin'],
  'Product Owner': ['/', '/workspace', '/dashboard', '/task', '/worklog/user', '/documentation','/userstory', '/backlog']
}

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)

  // Check public paths
  const publicPathsArray = Array.from(publicPaths)
  if (publicPathsArray.some((p: string) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // Verify token
  const token = request.cookies.get('token')?.value
  let payload
  try {
    payload = token ? await verifyToken(token) : null
  } catch {
    return pathname.startsWith('/login') ? NextResponse.next() : NextResponse.redirect(new URL('/login', request.url))
  }

  if (!payload) {
    return pathname.startsWith('/login') ? NextResponse.next() : NextResponse.redirect(new URL('/login', request.url))
  }

  // Set user headers
  const headers = new Headers(request.headers)
  headers.set('x-user-id', payload.user_id)
  headers.set('x-user-role', payload.role)

  // Check role access
  const role = payload.role as Role
  const allowedpathnames = roleAccess[role] || []
  if (!allowedpathnames.some((p: string) => pathname === p || pathname.startsWith(p + '/'))) {
    return pathname.startsWith('/unauthorized') ? NextResponse.next() : NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|static/).*)']
}
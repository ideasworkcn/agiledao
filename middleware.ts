import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

const publicPaths = new Set([
  '/login',
  '/register',
  '/',
  '/documentation',
  '/api/auth',
  '/api/md',
  '/workspace', 
  '/unauthorized',
  '/worklog/user'
])

type Role = 'Team Member' | 'Scrum Master' | 'Product Owner'
type RoleAccess = Record<Role, string[]>

const roleAccess: RoleAccess = {
  'Team Member': ['/', '/workspace', '/dashboard', '/task', '/worklog/user', '/documentation'],
  'Scrum Master': ['/product', '/sprint', '/team', '/userstory', '/backlog', '/worklog/admin'],
  'Product Owner': ['/userstory', '/backlog']
}

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)
  const path = pathname.replace(/\/+/g, '/').replace(/\/$/, '') || '/'

  // Check public paths
  const publicPathsArray = Array.from(publicPaths)
  if (publicPathsArray.some((p: string) => path === p || path.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // Verify token
  const token = request.cookies.get('token')?.value
  let payload
  try {
    payload = token ? await verifyToken(token) : null
  } catch {
    return path.startsWith('/login') ? NextResponse.next() : NextResponse.redirect(new URL('/login', request.url))
  }

  if (!payload) {
    return path.startsWith('/login') ? NextResponse.next() : NextResponse.redirect(new URL('/login', request.url))
  }

  // Set user headers
  const headers = new Headers(request.headers)
  headers.set('x-user-id', payload.user_id)
  headers.set('x-user-role', payload.role)

  // Check role access
  const role = payload.role as Role
  const allowedPaths = roleAccess[role] || []
  if (!allowedPaths.some((p: string) => path === p || path.startsWith(p + '/'))) {
    return path.startsWith('/unauthorized') ? NextResponse.next() : NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|static/).*)']
}
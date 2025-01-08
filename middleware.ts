import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Public paths that don't require authentication
const publicPaths = Object.freeze([
  '/login',
  '/register',
  '/',
  '/documentation(.*)', // Match all documentation paths and subpaths
  '/api/auth/login', 
  '/api/auth/register',
  '/api/auth/me', // Allow all auth endpoints
  '/api/md',
  '/workspace',
  '/unauthorized',
  '/api/(.*)', // Match all API paths and subpaths using regex pattern
  '/worklog/user',
  '/_next/static/(.*)', 
])

const protectedRoutes = [
  { path: '/', roles: ['Team Member', 'Scrum Master', 'Product Owner'] },
  { path: '/workspace', roles: ['Team Member', 'Scrum Master', 'Product Owner'] },
  { path: '/dashboard', roles: ['Team Member', 'Scrum Master', 'Product Owner'] },
  { path: '/task', roles: ['Team Member', 'Scrum Master', 'Product Owner'] },
  { path: '/worklog/user', roles: ['Team Member', 'Scrum Master', 'Product Owner'] },
  { path: '/documentation', roles: ['Team Member', 'Scrum Master', 'Product Owner'] },
  { path: '/product', roles: ['Scrum Master'] },
  { path: '/sprint', roles: ['Scrum Master'] },
  { path: '/team', roles: ['Scrum Master'] },
  { path: '/userstory', roles: ['Product Owner', 'Scrum Master'] },
  { path: '/backlog', roles: ['Product Owner', 'Scrum Master'] },
  { path: '/worklog/admin', roles: ['Scrum Master'] },
];

export async function middleware(request: NextRequest) {
  // Get base path by removing domain and query parameters
  const url = new URL(request.url)
  let path = url.pathname

  // Normalize path by removing trailing slashes and duplicate slashes
  path = path.replace(/\/+/g, '/').replace(/\/$/, '') || '/'

  console.log(`[Middleware] Request path: ${path}`)

  // Improved path matching function
  const isPublicPath = (publicPath: string) => {
    // Handle regex paths
    if (publicPath.includes('(.*)')) {
      const regex = new RegExp(`^${publicPath.replace('(.*)', '.*')}$`)
      return regex.test(path)
    }
    // Handle exact matches
    return path === publicPath || path.startsWith(publicPath + '/')
  }

  // Check if static resource path
  if (path.startsWith('/_next/static')) {
    return NextResponse.next()
  }

  // Allow public paths
  if (publicPaths.some(isPublicPath)) {
    console.log(`[Middleware] Public path accessed: ${path}`)
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get('token')?.value
  console.log(`[Middleware] Token found: ${!!token}`)

  // Verify JWT token
  let payload = null
  try {
    payload = token ? await verifyToken(token) : null
    console.log(`[Middleware] Token payload:`, payload)
  } catch (error) {
    console.error(`[Middleware] Token verification error:`, error)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to login if not authenticated
  if (!payload) {
    console.log(`[Middleware] Unauthenticated request, redirecting to login`)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Add user info to request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.user_id)
  requestHeaders.set('x-user-role', payload.role)

  // Get allowed paths based on user role from protectedRoutes
  const allowedPaths = protectedRoutes
    .filter(route => route.roles.includes(payload.role))
    .map(route => route.path)

  // Check if current path is allowed for user's role
  const isPathAllowed = allowedPaths.some(allowedPath => 
    path === allowedPath || path.startsWith(allowedPath + '/')
  )

  if (!isPathAllowed) {
    console.log(`[Middleware] Access denied for role ${payload.role} to path ${path}`)
    console.log(`Allowed paths for role ${payload.role}:`, allowedPaths)
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Continue with authenticated request
  console.log(`[Middleware] Proceeding with authenticated request`)
  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public paths
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
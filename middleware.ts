import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedPaths = [
  '/dashboard',
  '/gpu-marketplace',
  '/ai-models',
  '/earnings',
  '/connect-to-earn',
  '/wallet'
]

// Routes that should be accessible without auth
const publicPaths = ['/', '/auth/callback']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if it exists
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if accessing a protected route
  const isAccessingProtectedRoute = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  // Check if accessing auth callback
  const isAuthCallback = req.nextUrl.pathname.startsWith('/auth/callback')

  if (!session && isAccessingProtectedRoute && !isAuthCallback) {
    const redirectUrl = new URL('/', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

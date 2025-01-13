import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of protected routes that require authentication
const protectedPaths = [
  '/(main-components)/dashboard',
  '/(main-components)/gpu-marketplace',
  '/(main-components)/ai-models',
  '/(main-components)/earnings',
  '/(main-components)/connect-to-earn',
  '/wallet',
  '/(secondary-components)/community',
  '/settings',
  '/info',
  '/auth/profile',
  '/NodeNet'
]

// Public paths that don't require authentication
const publicPaths = ['/', '/auth/callback']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ 
    req, 
    res,
    cookieOptions: {
      name: 'sb-session',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    }
  })

  const { pathname } = req.nextUrl

  try {
    // Refresh session if needed
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error

    if (session) {
      // Check session expiry
      const expiresAt = session.expires_at || 0
      const now = Math.floor(Date.now() / 1000)
      
      if (expiresAt - now < 60 * 60) { // Less than 1 hour left
        const { error: refreshError } = await supabase.auth.refreshSession()
        if (refreshError) throw refreshError
      }

      // Remove the root page redirect from middleware
      // Let the root page handle its own redirects
    } else {
      // For protected paths, redirect to root (login) if not logged in
      const isProtectedPath = protectedPaths.some(path => 
        pathname === path || pathname.startsWith(`${path}/`)
      )

      if (isProtectedPath) {
        // Clear any stale cookies
        res.cookies.delete('sb-session')
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return res
  } catch (error) {
    console.error('Auth error:', error)
    // Clear cookies and redirect to login on auth error
    res.cookies.delete('sb-session')
    return NextResponse.redirect(new URL('/', req.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

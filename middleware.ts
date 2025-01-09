import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of protected routes that require authentication
const protectedPaths = [
  '/dashboard',
  '/gpu-marketplace',
  '/ai-models',
  '/earnings',
  '/connect-to-earn',
  '/wallet',
  '/community',
  '/settings',
  '/info',
  '/profile',
  '/NodeNet'
]

// Public paths that don't require authentication
const publicPaths = ['/', '/auth/callback']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { pathname } = req.nextUrl

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If logged in and on root (login) page, redirect to dashboard
  if (session && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // For protected paths, redirect to root (login) if not logged in
  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/',
    '/auth/callback',
    '/dashboard/:path*',
    '/gpu-marketplace/:path*',
    '/ai-models/:path*',
    '/earnings/:path*',
    '/connect-to-earn/:path*',
    '/wallet/:path*',
    '/community/:path*',
    '/settings/:path*',
    '/info/:path*',
    '/profile/:path*',
    '/NodeNet/:path*'
  ]
}

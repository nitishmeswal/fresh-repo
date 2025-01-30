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

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If there's no session and the user is trying to access a protected route
  if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/'
    redirectUrl.searchParams.delete('message')
    return NextResponse.redirect(redirectUrl)
  }

  // If there's a session and the user is on the home page, redirect to dashboard
  if (session && req.nextUrl.pathname === '/') {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

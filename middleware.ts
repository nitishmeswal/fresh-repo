import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If there's no session and trying to access protected routes
  if (!session && (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/profile') ||
    req.nextUrl.pathname.startsWith('/wallet') ||
    req.nextUrl.pathname.startsWith('/NodeNet')
  )) {
    const redirectUrl = new URL('/auth/sign-in', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If there's a session and user is on auth pages, redirect to dashboard
  if (session && (
    req.nextUrl.pathname.startsWith('/auth/sign-in') ||
    req.nextUrl.pathname.startsWith('/auth/sign-up')
  )) {
    const redirectUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/wallet/:path*',
    '/NodeNet/:path*',
    '/auth/:path*'
  ],
}
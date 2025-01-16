import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = [
  '/dashboard',
  '/gpu-marketplace',
  '/ai-models',
  '/earnings',
  '/connect-to-earn',
  '/wallet'
]

const publicPaths = ['/', '/auth/callback']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session && protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return res
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.redirect(new URL('/', req.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}

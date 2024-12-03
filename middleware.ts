import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.SECRET })
    const url = request.nextUrl
  return NextResponse.redirect(new URL('/home', request.url))
}
 
export const config = {
  matcher: ['/about/:path*',
            '/api/:path*',
            '/auth/:path*',
            '/'
  ],
}
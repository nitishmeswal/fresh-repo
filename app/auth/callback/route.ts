import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    try {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ 
        cookies: () => cookieStore,
        cookieOptions: {
          name: 'sb-session',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        }
      });
      
      // Exchange code for session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) throw exchangeError;

      // Get the user after exchange
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (user) {
        // Update user profile
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata.full_name,
          avatar_url: user.user_metadata.avatar_url,
          last_sign_in: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });
        if (profileError) throw profileError;

        // Set session cookie with strict settings
        const response = NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
        response.cookies.set('sb-session', user.id, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return response;
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      // Clear any existing cookies on error
      const response = NextResponse.redirect(new URL('/', requestUrl.origin));
      response.cookies.delete('sb-session');
      return response;
    }
  }

  // Something went wrong, redirect back to login
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}

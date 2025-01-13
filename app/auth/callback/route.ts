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
        // Ensure profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profile) {
          // Create profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                full_name: user.user_metadata.full_name,
                avatar_url: user.user_metadata.avatar_url,
                email: user.email,
              },
            ]);
          if (insertError) throw insertError;
        }

        // Set session cookie with strict settings
        const response = NextResponse.redirect(new URL('/(main-components)/dashboard', requestUrl.origin));
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

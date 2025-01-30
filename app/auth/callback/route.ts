import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
      // Exchange code for session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) throw exchangeError;

      // Get the user after exchange
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) {
        throw new Error('No user found after authentication');
      }

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
              full_name: user.user_metadata.full_name || user.email?.split('@')[0],
              avatar_url: user.user_metadata.avatar_url,
              email: user.email,
            },
          ])
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          // Continue even if profile creation fails
        }
      }

      // Redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));

    } catch (error) {
      console.error('Auth callback error:', error);
      
      // Clear any partial auth state
      await supabase.auth.signOut();
      
      // Redirect to home with error
      const redirectUrl = new URL('/', requestUrl.origin);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // No code found, redirect to home
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}

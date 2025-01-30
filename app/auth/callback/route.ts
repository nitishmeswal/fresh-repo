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
      await supabase.auth.exchangeCodeForSession(code);

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

        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(new URL('/', requestUrl.origin));
    }
  }

  // Something went wrong, redirect back to login
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}

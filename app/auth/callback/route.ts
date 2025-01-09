import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange code for session
    await supabase.auth.exchangeCodeForSession(code);

    // Get the user after exchange
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Update user profile
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name,
        avatar_url: user.user_metadata.avatar_url,
        last_sign_in: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });
    }

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
  }

  // Something went wrong, redirect back to login
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}

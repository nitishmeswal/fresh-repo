import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Client-side Supabase client (for components and hooks)
export const createBrowserClient = () => {
  return createClientComponentClient();
};

// Direct Supabase client (for API routes)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

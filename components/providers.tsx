'use client';

import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session && (
          window.location.pathname.startsWith('/dashboard') ||
          window.location.pathname.startsWith('/gpu-marketplace') ||
          window.location.pathname.startsWith('/ai-models') ||
          window.location.pathname.startsWith('/earnings') ||
          window.location.pathname.startsWith('/connect-to-earn') ||
          window.location.pathname.startsWith('/wallet')
        )) {
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && (
        window.location.pathname.startsWith('/dashboard') ||
        window.location.pathname.startsWith('/gpu-marketplace') ||
        window.location.pathname.startsWith('/ai-models') ||
        window.location.pathname.startsWith('/earnings') ||
        window.location.pathname.startsWith('/connect-to-earn') ||
        window.location.pathname.startsWith('/wallet')
      )) {
        router.push('/');
      }
    });

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      disableTransitionOnChange
    >
      <ToastProvider>
        {children}
        <Toaster position="top-center" />
      </ToastProvider>
    </ThemeProvider>
  );
}

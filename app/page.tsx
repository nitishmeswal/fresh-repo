'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import PageTransition from "@/components/page-transition";
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { signInWithGoogle, signInWithGithub } from '@/lib/supabase/client';

export default function RootPage() {
  const router = useRouter();
  const { user, loading } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (!loading) {
        if (user) {
          // User is authenticated, redirect to dashboard
          router.replace('/(main-components)/dashboard');
        }
      }
    };

    checkAuthAndRedirect();
  }, [user, loading, router]);

  const handleSignIn = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      const signIn = provider === 'google' ? signInWithGoogle : signInWithGithub;
      await signIn();
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, show loading while redirecting
  if (user) {
    return null;
  }

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 max-w-2xl mx-auto"
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-blue-400">
            Welcome to NeuroLov
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-[600px] mx-auto">
            Join our decentralized compute network and revolutionize AI model training
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              size="lg"
              onClick={() => handleSignIn('google')}
              disabled={isLoading}
              className="bg-white text-black hover:bg-gray-100 flex items-center gap-2"
            >
              <Image src="/google.svg" alt="Google" width={20} height={20} />
              Sign in with Google
            </Button>
            <Button
              size="lg"
              onClick={() => handleSignIn('github')}
              disabled={isLoading}
              className="bg-[#24292F] hover:bg-[#24292F]/90 flex items-center gap-2"
            >
              <Image src="/github.svg" alt="GitHub" width={20} height={20} />
              Sign in with GitHub
            </Button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
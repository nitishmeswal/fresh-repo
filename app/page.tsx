'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import PageTransition from "@/components/page-transition";
import { useUser } from '@/lib/hooks/useUser';
import ParticleEffect from '@/particle-effect/ParticleEffect';

export default function RootPage() {
  const router = useRouter();
  const { user, loading, supabase } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error('Error signing in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error('Error signing in with GitHub');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return null;

  return (
    <PageTransition>
      <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-r from-[#3B82F6]/30 to-[#8B5CF6]/30 blur-[120px] animate-pulse-slow" />
          <div className="absolute -bottom-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-r from-[#10B981]/30 to-[#3B82F6]/30 blur-[120px] animate-pulse-slower" />
        </div>

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-[8px]" />

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4">
          {/* Logo and Particle Effect Container */}
          <div className="w-[900px] h-[800px] relative -mt-20 mx-auto flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full"
            >
              <ParticleEffect
                modelPath="/logo.glb"
                width={900}
                height={800}
                particleCount={50000}
                particleSize={0.004}
                particleColor={0x40A6FF}
                disperseSpeed={0.1}
                disperseDistance={3.0}
              />
            </motion.div>
          </div>

          {/* Login Container with enhanced animations */}
          <div className="flex flex-col items-center -mt-40">
            {/* Brand logo with glow effect */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <img src="/neurolov-logo.svg" alt="Neurolov" className="h-12" />
            </motion.div>

            {/* Welcome text with staggered animation */}
            <motion.div
              className="flex flex-col items-center"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              <motion.h1
                className="text-lg font-semibold mt-1 text-gray-200"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                Welcome to Compute
              </motion.h1>
              <motion.p
                className="text-gray-400 text-sm mt-0.5 mb-6"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                Sign in to access your dashboard
              </motion.p>
            </motion.div>

            {/* Auth buttons with hover effects */}
            <motion.div
              className="flex flex-col gap-3 w-full max-w-xs"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    delayChildren: 0.6,
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium relative overflow-hidden transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue with Google
                </Button>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <Button
                  onClick={handleGithubSignIn}
                  disabled={isLoading}
                  className="w-full py-6 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-xl font-medium relative overflow-hidden transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue with GitHub
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
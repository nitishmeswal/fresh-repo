'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain, Cpu, Network, Wallet, User } from "lucide-react";
import { motion } from "framer-motion";
import { useCredits } from '@/contexts/credits-context';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';
import NodeNetPage from '../NodeNet/page';
import { WelcomeCreditsDialog } from "@/components/welcome-credits";
import ProfileDropdown from '@/components/profile-dropdown';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const glowAnimation = {
  animate: {
    boxShadow: ["0 0 0 rgba(59, 130, 246, 0)", "0 0 20px rgba(59, 130, 246, 0.3)", "0 0 0 rgba(59, 130, 246, 0)"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const DashboardPage = () => {
  const { credits, plan, loading } = useCredits();
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/');
          return;
        }

        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile(data);
          console.log('Profile data:', data); // For debugging
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    getProfile();
  }, [supabase, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-full">
      <div className="p-6 lg:p-8 relative">
        <WelcomeCreditsDialog />
        
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-full bg-[url('/grid.svg')] opacity-20" />
          <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-black" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <Card className="p-6 bg-black/50 backdrop-blur-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Welcome back, {profile?.full_name || 'User'}
                  </h1>
                  <p className="text-sm text-gray-400">
                    Member since {profile?.created_at ? formatDate(profile.created_at) : ''}
                  </p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Current Plan</p>
                    <p className="text-lg font-semibold">{plan || 'Free Plan'}</p>
                  </div>
                  <div className="h-10 w-px bg-gray-700" />
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Available Credits</p>
                    <p className="text-lg font-semibold">{loading ? '...' : `${credits} Credits`}</p>
                  </div>
                  <div className="h-10 w-px bg-gray-700" />
                  <div className="ml-auto">
                    <ProfileDropdown />
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/wallet')}
                  className="bg-black/50 border-white/10 hover:bg-white/10 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                  <Wallet className="mr-2 h-4 w-4" />
                  Add Credits
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/profile')}
                  className="bg-black/50 border-white/10 hover:bg-white/10 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Models Card */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-6 bg-black/50 backdrop-blur-xl border border-white/10 relative group">
                <motion.div variants={glowAnimation} animate="animate" className="absolute inset-0 rounded-lg" />
                <h2 className="text-2xl font-bold mb-4">AI Models</h2>
                <p className="text-gray-400 mb-4">
                  Deploy and manage your AI models with ease. Access pre-trained models or upload your own.
                </p>
                <button 
                  onClick={() => router.push('/ai-models')}
                  className={styles.revealButton}
                >
                  <div className={styles.buttonText}>Manage Models</div>
                </button>
              </Card>
            </motion.div>

            {/* GPU Marketplace Card */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-6 bg-black/50 backdrop-blur-xl border border-white/10 relative group">
                <motion.div variants={glowAnimation} animate="animate" className="absolute inset-0 rounded-lg" />
                <h2 className="text-2xl font-bold mb-4">GPU Marketplace</h2>
                <p className="text-gray-400 mb-4">
                  Rent or provide GPU computing power. Access high-performance GPUs on demand.
                </p>
                <button 
                  onClick={() => router.push('/gpu-marketplace')}
                  className={styles.revealButton}
                >
                  <div className={styles.buttonText}>Explore GPUs</div>
                </button>
              </Card>
            </motion.div>

            {/* Connect to Earn Card */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-6 bg-black/50 backdrop-blur-xl border border-white/10 relative group">
                <motion.div variants={glowAnimation} animate="animate" className="absolute inset-0 rounded-lg" />
                <h2 className="text-2xl font-bold mb-4">Connect to Earn</h2>
                <p className="text-gray-400 mb-4">
                  Share your compute resources and earn credits. Monitor your earnings in real-time.
                </p>
                <button 
                  onClick={() => router.push('/connect-to-earn')}
                  className={styles.revealButton}
                >
                  <div className={styles.buttonText}>Start Earning</div>
                </button>
              </Card>
            </motion.div>

            {/* NodeNet Card */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-6 bg-black/50 backdrop-blur-xl border border-white/10 relative group">
                <motion.div variants={glowAnimation} animate="animate" className="absolute inset-0 rounded-lg" />
                <h2 className="text-2xl font-bold mb-4">NodeNet</h2>
                <p className="text-gray-400 mb-4">
                  Join our decentralized compute network. View network status and connected nodes.
                </p>
                <button 
                  onClick={() => router.push('/NodeNet')}
                  className={styles.revealButton}
                >
                  <div className={styles.buttonText}>View Network</div>
                </button>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
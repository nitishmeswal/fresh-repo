'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain, Cpu, Network, Wallet, User } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/supabase/supabase-provider';

const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
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
  const router = useRouter();
  const { user, loading } = useSupabase();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [loading, user, router]);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const features = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "GPU Marketplace",
      description: "Rent GPUs for your AI workloads",
      link: "/(main-components)/gpu-marketplace",
      color: "bg-blue-500/10"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Models",
      description: "Deploy and manage AI models",
      link: "/(main-components)/ai-models",
      color: "bg-purple-500/10"
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "Connect to Earn",
      description: "Earn by sharing your compute",
      link: "/(main-components)/connect-to-earn",
      color: "bg-green-500/10"
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Earnings",
      description: "Track your earnings",
      link: "/(main-components)/earnings",
      color: "bg-yellow-500/10"
    }
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user.user_metadata?.full_name || 'User'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Your decentralized compute journey starts here
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Link href={feature.link} key={index}>
            <Card
              className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${feature.color} backdrop-blur-lg border border-gray-800`}
            >
              <motion.div
                variants={glowAnimation}
                animate="animate"
                className="mb-4 p-2 rounded-lg inline-block"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
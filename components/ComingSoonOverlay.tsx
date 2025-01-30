'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/hooks/useUser';
import { BiLogoGmail } from 'react-icons/bi';

interface ComingSoonOverlayProps {
  version?: string;
  title?: string;
  description?: string;
  type?: 'hover' | 'fixed' | 'toast' | 'banner';
  className?: string;
}

const DEV_EMAILS = ['nitishmeswal@gmail.com', 'neohex262@gmail.com', 'neurolov.ai@gmail.com'];

export const ComingSoonOverlay = ({ 
  version = '2.0', 
  title = 'Coming Soon',
  description = 'This feature will be available in the next version!',
  type = 'fixed',
  className = ''
}: ComingSoonOverlayProps) => {
  const { user } = useUser();
  
  // If user is a developer, don't show any overlay
  if (user?.email && DEV_EMAILS.includes(user.email)) {
    return null;
  }

  if (type === 'toast') {
    return (
      <Button
        onClick={() => {
          toast.info(`${title} in Version ${version}! 🚀`, {
            description: description,
            action: {
              label: "Notify Me",
              onClick: () => toast.success('We\'ll notify you when it\'s ready!')
            }
          });
        }}
      >
        {title}
      </Button>
    );
  }

  if (type === 'hover') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
        <div className="relative z-10 p-4 text-center">
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-300">
            {description}
          </p>
        </div>
      </motion.div>
    );
  }

  if (type === 'banner') {
    return (
      <div className={`relative overflow-hidden rounded-lg p-4 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm" />
        <div className="web3-glow absolute inset-0 opacity-10" />
        <div className="relative z-10">
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-300">
            {description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 bg-black/60 p-8 rounded-2xl max-w-md w-full border border-blue-500/20 mx-auto mt-[20vh]"
      >
        <div className="relative z-10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            {title}
          </h2>
          <p className="text-gray-300 mb-6">
            {description}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Coming in Version {version}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button
              onClick={() => toast.success('You will be notified when this feature launches!')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              Get Notified
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

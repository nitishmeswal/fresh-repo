'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/hooks/useUser';

interface ComingSoonOverlayProps {
  version?: string;
  title?: string;
  description?: string;
  type?: 'hover' | 'fixed' | 'toast' | 'banner';
  className?: string;
}

const DEV_EMAILS = ['nitishmeswal@gmail.com', 'neohex262@gmail.com'];

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

  if (type === 'banner') {
    return (
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
        <p className="text-blue-400 text-center font-medium">
          🚀 {title} coming in Version {version}! {description}
        </p>
      </div>
    );
  }

  if (type === 'hover') {
    return (
      <motion.div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 z-50 ${className}`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="text-center space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Version {version}
          </span>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
            {description}
          </p>
        </div>
      </motion.div>
    );
  }

  // Default fixed overlay
  return (
    <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl transition-all duration-500 ${className}`}>
      <div className="text-center space-y-4 p-6">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Version {version}
        </span>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-gray-400 text-sm max-w-[250px]">
          {description}
        </p>
      </div>
    </div>
  );
};

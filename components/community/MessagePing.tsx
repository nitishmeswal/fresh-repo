'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, X } from 'lucide-react';

interface Notification {
  id: number;
  message: string;
  user: string;
  type: 'message' | 'mention' | 'achievement';
  timestamp: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    message: 'mentioned you in a post',
    user: 'Neurolovian #5678',
    type: 'mention',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    message: 'sent you a message',
    user: 'Neurolovian #9012',
    type: 'message',
    timestamp: new Date().toISOString()
  },
  {
    id: 3,
    message: 'Achievement Unlocked: First Connection!',
    user: 'System',
    type: 'achievement',
    timestamp: new Date().toISOString()
  }
];

export const MessagePing: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= mockNotifications.length) return;

    const timer = setTimeout(() => {
      setNotifications(prev => [...prev, mockNotifications[index]]);
      setIndex(i => i + 1);
    }, 3000);

    return () => clearTimeout(timer);
  }, [index]);

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 space-y-4 z-50">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg min-w-[300px]"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              notification.type === 'achievement' ? 'bg-yellow-500/20' :
              notification.type === 'mention' ? 'bg-purple-500/20' :
              'bg-blue-500/20'
            }`}>
              <Bell className={`w-4 h-4 ${
                notification.type === 'achievement' ? 'text-yellow-500' :
                notification.type === 'mention' ? 'text-purple-500' :
                'text-blue-500'
              }`} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {notification.user}
              </p>
              <p className="text-sm text-gray-400">
                {notification.message}
              </p>
            </div>

            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

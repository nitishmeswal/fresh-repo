'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MessagePing: React.FC = () => {
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([]);
  
  const notifications = [
    {
      id: 1,
      type: 'message',
      sender: 'GPUMaster',
      content: 'Thanks for sharing your mining configuration!',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'system',
      content: 'Your node has completed 24 hours of continuous uptime. Great job!',
      time: '2 hours ago',
      read: true
    },
    {
      id: 3,
      type: 'achievement',
      content: 'You\'ve earned the "Reliable Node" badge!',
      time: '1 day ago',
      read: true
    }
  ];

  useEffect(() => {
    // Show each notification with a delay
    notifications.forEach((notification, index) => {
      setTimeout(() => {
        setVisibleNotifications(prev => [...prev, notification.id]);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
          setVisibleNotifications(prev => prev.filter(id => id !== notification.id));
        }, 5000);
      }, index * 2000); // Show each notification 2 seconds apart
    });

    // Cleanup timeouts on unmount
    return () => {
      setVisibleNotifications([]);
    };
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'system':
        return <Bell className="w-5 h-5 text-yellow-500" />;
      case 'achievement':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 space-y-4 z-[100] max-w-md">
      <AnimatePresence>
        {notifications
          .filter(notification => visibleNotifications.includes(notification.id))
          .map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`p-4 ${
                  !notification.read ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        {notification.type === 'message' && (
                          <p className="font-semibold text-sm">{notification.sender}</p>
                        )}
                        <p className="text-gray-600 dark:text-gray-300">
                          {notification.content}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <Badge variant="secondary">New</Badge>
                        )}
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {notification.time}
                        </span>
                      </div>
                    </div>
                    {notification.type === 'message' && (
                      <Button variant="ghost" size="sm" className="mt-2">
                        Reply
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

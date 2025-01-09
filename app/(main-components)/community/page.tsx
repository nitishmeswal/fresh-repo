'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileCard } from '@/components/community/ProfileCard';
import { TalkHub } from '@/components/community/TalkHub';
import { NewsHub } from '@/components/community/NewsHub';
import { MessagePing } from '@/components/community/MessagePing';
import { Users, MessageSquare, Newspaper, Zap, Trophy } from 'lucide-react';
import { motion } from "framer-motion";

export default function Community() {
  const [activeTab, setActiveTab] = useState('profile');

  const userStats = {
    level: 3,
    experience: 2750,
    nextLevelXP: 3000,
    contributions: 156,
    nodesHelped: 42,
    reputation: 4.8,
    badges: ['Early Adopter', 'Problem Solver', 'Community Guide'],
    achievements: [
      { name: 'First Connection', description: 'Made your first node connection' },
      { name: 'Helper', description: 'Helped 10 nodes with their queries' },
      { name: 'Rising Star', description: 'Reached Level 3 in the community' }
    ]
  };

  return (
    <div className="container mx-auto p-6 space-y-8 relative group">
      {/* Coming Soon Overlay */}
      <motion.div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 z-50"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="text-center space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Version 2.0
          </span>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Coming Soon
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
             Community experience will be live in Version 2.0!
          </p>
        </div>
      </motion.div>

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          NeuroLov Community Hub
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Connect with fellow Neurolovians, share knowledge, and level up your journey
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Profile Card */}
        <div className="lg:col-span-1">
          <ProfileCard stats={userStats} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 bg-[#1A1A1A] border-gray-800">
              <TabsTrigger value="talk-hub" className="data-[state=active]:bg-blue-500/20">
                <MessageSquare className="w-4 h-4 mr-2" />
                Talk Hub
              </TabsTrigger>
              <TabsTrigger value="news" className="data-[state=active]:bg-purple-500/20">
                <Newspaper className="w-4 h-4 mr-2" />
                News Feed
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="data-[state=active]:bg-green-500/20">
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="talk-hub">
              <TalkHub />
            </TabsContent>

            <TabsContent value="news">
              <NewsHub />
            </TabsContent>

            <TabsContent value="leaderboard">
              <Card className="p-6 bg-[#1A1A1A] border-gray-800">
                <div className="space-y-6">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-blue-500 font-bold">#{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">Neurolovian #{index + 1}</h3>
                          <p className="text-sm text-gray-400">Level {6 - index}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Contribution Score</p>
                          <p className="text-lg font-bold text-white">{1000 - index * 50}</p>
                        </div>
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Message Ping Overlay */}
      <MessagePing />
    </div>
  );
}

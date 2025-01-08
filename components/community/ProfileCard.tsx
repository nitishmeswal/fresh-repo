'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Users, Award, Zap } from 'lucide-react';

interface Achievement {
  name: string;
  description: string;
}

interface ProfileStats {
  level: number;
  experience: number;
  nextLevelXP: number;
  contributions: number;
  nodesHelped: number;
  reputation: number;
  badges: string[];
  achievements: Achievement[];
}

interface ProfileCardProps {
  stats: ProfileStats;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ stats }) => {
  const experiencePercentage = (stats.experience / stats.nextLevelXP) * 100;

  const levelColors = {
    1: 'from-blue-500 to-blue-700',
    2: 'from-green-500 to-green-700',
    3: 'from-purple-500 to-purple-700',
    4: 'from-yellow-500 to-yellow-700',
    5: 'from-red-500 to-red-700',
    6: 'from-pink-500 to-pink-700'
  };

  const currentLevelColor = levelColors[stats.level as keyof typeof levelColors] || 'from-blue-500 to-blue-700';

  return (
    <Card className="p-6 bg-[#1A1A1A] border-gray-800">
      {/* Profile Header */}
      <div className="relative">
        <div className="w-24 h-24 mx-auto">
          <div className={`w-full h-full rounded-full bg-gradient-to-br ${currentLevelColor} p-1`}>
            <div className="w-full h-full rounded-full bg-[#1A1A1A] p-2">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">L{stats.level}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold text-white">Neurolovian #1234</h2>
          <p className="text-sm text-gray-400">Active Node</p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Level {stats.level}</span>
          <span className="text-gray-400">Level {stats.level + 1}</span>
        </div>
        <Progress value={experiencePercentage} className="h-2" />
        <p className="text-center text-sm text-gray-400">
          {stats.experience} / {stats.nextLevelXP} XP
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-3 rounded-lg bg-gray-800/50">
          <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{stats.nodesHelped}</p>
          <p className="text-xs text-gray-400">Nodes Helped</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-gray-800/50">
          <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{stats.reputation}</p>
          <p className="text-xs text-gray-400">Reputation</p>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Badges</h3>
        <div className="flex flex-wrap gap-2">
          {stats.badges.map((badge, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20"
            >
              <Award className="w-3 h-3 mr-1" />
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Recent Achievements</h3>
        <div className="space-y-3">
          {stats.achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
            >
              <Trophy className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium text-white">{achievement.name}</p>
                <p className="text-sm text-gray-400">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

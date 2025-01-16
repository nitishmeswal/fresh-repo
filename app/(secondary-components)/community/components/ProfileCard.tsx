'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Award, Users } from 'lucide-react';

interface ProfileCardProps {
  stats: {
    level: number;
    experience: number;
    nextLevelXP: number;
    contributions: number;
    nodesHelped: number;
    reputation: number;
    badges: string[];
    achievements: {
      name: string;
      description: string;
    }[];
  };
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ stats }) => {
  const progressPercentage = (stats.experience / stats.nextLevelXP) * 100;

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Level {stats.level}</h2>
            <p className="text-gray-500">Experience: {stats.experience}/{stats.nextLevelXP}</p>
          </div>
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        <Progress value={progressPercentage} className="h-2 mb-4" />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <p className="font-semibold">{stats.reputation}</p>
            <p className="text-sm text-gray-500">Reputation</p>
          </div>
          <div className="text-center">
            <Award className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p className="font-semibold">{stats.contributions}</p>
            <p className="text-sm text-gray-500">Contributions</p>
          </div>
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="font-semibold">{stats.nodesHelped}</p>
            <p className="text-sm text-gray-500">Nodes Helped</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Badges</h3>
        <div className="flex flex-wrap gap-2">
          {stats.badges.map((badge, index) => (
            <Badge key={index} variant="secondary">
              {badge}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Achievements</h3>
        <div className="space-y-3">
          {stats.achievements.map((achievement, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
              <h4 className="font-medium">{achievement.name}</h4>
              <p className="text-sm text-gray-500">{achievement.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

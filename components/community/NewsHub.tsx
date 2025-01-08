'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ArrowRight, Star, TrendingUp, Zap, Calendar } from 'lucide-react';

export const NewsHub: React.FC = () => {
  const news = [
    {
      id: 1,
      title: 'NeuroLov Network Upgrade',
      description: 'Major performance improvements and new features coming to the network. Get ready for enhanced mining capabilities and better rewards!',
      category: 'Network Update',
      date: '2025-01-05',
      readTime: '3 min',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Community Milestone: 10,000 Active Nodes',
      description: "We have reached a significant milestone with 10,000 active nodes contributing to the network. Special rewards program announced!",
      category: 'Announcement',
      date: '2025-01-04',
      readTime: '4 min',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'New GPU Support Added',
      description: 'Added support for the latest GPU models. Check if your hardware is compatible with the new optimization features.',
      category: 'Technical',
      date: '2025-01-03',
      readTime: '5 min',
      priority: 'medium'
    }
  ];

  const categoryIcons = {
    'Network Update': Zap,
    'Announcement': Star,
    'Technical': TrendingUp
  };

  const priorityColors = {
    high: 'from-red-500 to-orange-500',
    medium: 'from-blue-500 to-purple-500',
    low: 'from-green-500 to-teal-500'
  };

  return (
    <div className="space-y-6">
      {/* Featured News */}
      <Card className="p-6 bg-[#1A1A1A] border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Latest Updates</h2>
          </div>

          <div className="space-y-6">
            {news.map((item) => {
              const CategoryIcon = categoryIcons[item.category as keyof typeof categoryIcons];
              const priorityColor = priorityColors[item.priority as keyof typeof priorityColors];

              return (
                <div
                  key={item.id}
                  className="relative p-6 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-all group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity rounded-lg"
                       style={{ backgroundImage: `linear-gradient(to right, ${priorityColor})` }}
                  />
                  
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-500/10 border-blue-500/20"
                        >
                          {CategoryIcon && <CategoryIcon className="w-3 h-3 mr-1" />}
                          {item.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-400 mb-4">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          {item.readTime} read
                        </span>
                        <Button variant="ghost" className="text-blue-500 hover:text-blue-400">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

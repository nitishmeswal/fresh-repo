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
      description: 'Support for the latest GPU models has been added. Check the compatibility list and optimize your mining setup.',
      category: 'Technical Update',
      date: '2025-01-03',
      readTime: '5 min',
      priority: 'medium'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Network Update':
        return <Zap className="w-5 h-5" />;
      case 'Announcement':
        return <Star className="w-5 h-5" />;
      case 'Technical Update':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Newspaper className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <Card key={item.id} className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{item.category}</Badge>
                <Badge className={getPriorityColor(item.priority)}>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                </Badge>
              </div>
              {getCategoryIcon(item.category)}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {item.date}
                </div>
                <div>
                  <Newspaper className="w-4 h-4 inline mr-1" />
                  {item.readTime} read
                </div>
              </div>
              <Button variant="ghost">
                Read More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

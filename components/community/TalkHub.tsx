'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Share2, Tag, Send, AtSign } from 'lucide-react';

interface Post {
  id: number;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
  comments: string[];
  shares: number;
  tags: string[];
}

export const TalkHub: React.FC = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      content: "Just optimized my GPU mining setup! Seeing a 15% increase in efficiency. Happy to share my configuration with fellow Neurolovians. #optimization #mining",
      author: "NeuroMiner_42",
      timestamp: "2025-01-05T02:30:00Z",
      likes: 24,
      comments: ["Great work!", "Please share your settings"],
      shares: 8,
      tags: ["#optimization", "#mining"]
    },
    {
      id: 2,
      content: "New to the community! Looking forward to contributing my computing power to meaningful AI research. Any tips for beginners? #newbie",
      author: "AIEnthusiast",
      timestamp: "2025-01-05T01:45:00Z",
      likes: 15,
      comments: ["Welcome!", "Check out the getting started guide"],
      shares: 3,
      tags: ["#newbie"]
    }
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPost.trim()) {
      setPosts([
        {
          id: posts.length + 1,
          content: newPost,
          author: 'Current User',
          timestamp: new Date().toISOString(),
          likes: 0,
          comments: [],
          shares: 0,
          tags: ['#neurolov', '#community']
        },
        ...posts
      ]);
      setNewPost('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card className="p-6 bg-[#1A1A1A] border-gray-800">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Textarea
              placeholder="Share your thoughts with the community..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] bg-gray-900 border-gray-800 focus:border-blue-500"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-gray-400">
                  <Tag className="w-4 h-4 mr-2" />
                  Tag
                </Button>
                <Button variant="outline" size="sm" className="text-gray-400">
                  <AtSign className="w-4 h-4 mr-2" />
                  Mention
                </Button>
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-6 bg-[#1A1A1A] border-gray-800">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">{post.author}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(post.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-gray-300">{post.content}</p>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-blue-500/10 border-blue-500/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-gray-800">
                <Button variant="ghost" className="text-gray-400 hover:text-red-500">
                  <Heart className="w-4 h-4 mr-2" />
                  {post.likes}
                </Button>
                <Button variant="ghost" className="text-gray-400 hover:text-blue-500">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {post.comments.length}
                </Button>
                <Button variant="ghost" className="text-gray-400 hover:text-green-500">
                  <Share2 className="w-4 h-4 mr-2" />
                  {post.shares}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

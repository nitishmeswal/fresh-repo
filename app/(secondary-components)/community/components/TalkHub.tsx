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
      tags: ["optimization", "mining"]
    },
    {
      id: 2,
      content: "Looking for advice on cooling solutions for a multi-GPU setup. Any recommendations? #hardware #cooling",
      author: "CoolMiner",
      timestamp: "2025-01-04T18:15:00Z",
      likes: 15,
      comments: ["Water cooling is the way to go", "Check out the new Noctua fans"],
      shares: 5,
      tags: ["hardware", "cooling"]
    }
  ]);

  const handlePost = () => {
    if (!newPost.trim()) return;

    const newPostObj: Post = {
      id: posts.length + 1,
      content: newPost,
      author: "CurrentUser",
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      shares: 0,
      tags: newPost.match(/#\w+/g)?.map(tag => tag.slice(1)) || []
    };

    setPosts([newPostObj, ...posts]);
    setNewPost('');
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <Textarea
            placeholder="Share your thoughts with the community..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Tag className="w-4 h-4 mr-2" />
                Add Tags
              </Button>
              <Button variant="outline" size="sm">
                <AtSign className="w-4 h-4 mr-2" />
                Mention
              </Button>
            </div>
            <Button onClick={handlePost}>
              <Send className="w-4 h-4 mr-2" />
              Post
            </Button>
          </div>
        </div>
      </Card>

      {posts.map((post) => (
        <Card key={post.id} className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{post.author}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
            <div className="flex space-x-4 pt-2">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                {post.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                {post.comments.length}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                {post.shares}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

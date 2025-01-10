// components/community/PostCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { FiHeart, FiMessageCircle, FiBookmark } from 'react-icons/fi';

interface PostStats {
  views: string;
  likes: string;
  comments: string;
}

interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface Post {
  id: number;
  title: string;
  tags: string[];
  graph?: string;
  author: Author;
  stats: PostStats;
}

interface PostCardProps {
  post: Post;
  theme: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, theme }) => {
  return (
    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            {post.author.avatar && (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{post.author.name}</h3>
            <p className="text-sm text-gray-500">{post.author.role}</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <FiBookmark size={20} />
        </button>
      </div>

      <h2 className="mt-4 text-lg font-semibold">{post.title}</h2>

      {post.tags && (
        <div className="flex gap-2 mt-3">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {post.graph && (
        <div className="mt-4 relative h-48 rounded-lg overflow-hidden">
          <Image
            src={post.graph}
            alt="Post visualization"
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FiHeart className="text-gray-500" />
            <span className="text-sm text-gray-500">{post.stats.likes}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMessageCircle className="text-gray-500" />
            <span className="text-sm text-gray-500">{post.stats.comments}</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">{post.stats.views} views</div>
      </div>
    </div>
  );
};

export default PostCard;
// components/community/PostCard.tsx
'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { FiHeart, FiMessageCircle, FiBookmark } from 'react-icons/fi';

interface PostStats {
  views: number | string;
  likes: number | string;
  comments: number | string;
}

interface Author {
  name: string;
  role: string;
  avatar: StaticImageData;
}

interface Post {
  title: string;
  tags: string[];
  graph?: StaticImageData;
  author: Author;
  stats: PostStats;
}

interface PostCardProps {
  post: Post;
  theme: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, theme }) => (
  <div className={`mr-4 p-6 rounded-xl flex justify-between ${
    theme === "dark" ? 'bg-gray-950' : 'bg-gray-100'
  }`}>
    <div className="flex gap-6">
      {post.graph && (
        <div className="w-[100px] h-[100px] bg-[#1E1E1E] rounded-lg overflow-hidden">
          <Image src={post.graph} alt="Statistics" className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="flex-1 relative">
        <h2 className={`text-lg font-semibold mb-3 ${
          theme === "dark" ? 'text-white' : 'text-black'
        }`}>
          {post.title}
        </h2>
        
        <div className="flex gap-2 mb-4">
          {post.tags.map(tag => (
            <span key={tag} className={`px-3 py-1 rounded-3xl text-sm ${
              theme === "dark" 
                ? 'bg-[#2C353D] text-green-400' 
                : 'bg-slate-300 text-green-600'
            }`}>
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Image 
            src={post.author.avatar} 
            alt={post.author.name} 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className={`font-medium ${
              theme === "dark" ? 'text-white' : 'text-black'
            }`}>
              {post.author.name}
            </h3>
            <span className={
              theme === "dark" ? 'text-green-400' : 'text-green-600'
            }>
              {post.author.role}
            </span>
          </div>
        </div>

        <div className="flex gap-4 text-sm">
          {Object.entries(post.stats).map(([key, value]) => (
            <span key={key} className={
              theme === "dark" ? 'text-green-400' : 'text-green-600'
            }>
              {value} {key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
          ))}
        </div>
      </div>
    </div>
    
    <div className="flex flex-col gap-4">
      {[FiHeart, FiMessageCircle, FiBookmark].map((Icon, index) => (
        <button 
          key={index} 
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label={`${['Like', 'Comment', 'Bookmark'][index]} post`}
        >
          <Icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  </div>
);

export default PostCard;
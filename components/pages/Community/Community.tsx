// components/community/Community.tsx
'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import PostCard from './postcard';
import MeetupCard from './meetup';
import AccountSummary from './accountSummery';
import { accountSummary, meetups, posts } from '@/utils/constant';

const Community: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="w-full pl-4 py-6  ">
      <div className="flex overflow-hidden h-screen">
        <div className="w-[52vw] overflow-y-auto flex flex-col gap-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} theme={theme!} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="flex-1 flex flex-col gap-4">
          <AccountSummary accountSummary={accountSummary} theme={theme!} />

          {/* Meetups Section */}
          <div className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${
                theme === "dark" ? 'text-white' : 'text-black'
              }`}>
                Meetups
              </h3>
              <button className={`text-sm hover:underline hover:transition-all duration-500 ${
                theme === "dark" ? 'text-white' : 'text-black'
              }`}>
                View all
              </button>
            </div>
            
            {meetups.map(meetup => (
              <MeetupCard key={meetup.id} meetup={meetup} theme={theme!} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
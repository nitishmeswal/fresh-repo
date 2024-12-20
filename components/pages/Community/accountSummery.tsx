
'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { LandingRating } from '../../ui/rating';

interface Badge {
  type: string;
  image: string;
  active: boolean;
}

interface AccountSummaryData {
  name: string;
  image: StaticImageData;
  rating: number | string;
  badges: Badge[];
}

interface AccountSummaryProps {
  accountSummary: AccountSummaryData;
  theme: string;
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ accountSummary, theme }) => (
  <div className={`p-4 rounded-xl ${
    theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'
  }`}>
    <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
    
    <div className="flex items-center gap-4 mb-4">
      <Image 
        src={accountSummary.image} 
        alt="Profile" 
        className="w-[60px] h-[60px] rounded-full"
      />
      <div>
        <h4 className={`font-medium ${
          theme === "dark" ? 'text-white' : 'text-black'
        }`}>
          {accountSummary.name}
        </h4>
        <div className="flex items-center gap-2">
          <span className={
            theme === "dark" ? 'text-white' : 'text-black'
          }>
            {accountSummary.rating}
          </span>
          <LandingRating rating={4.3} />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2">
      {accountSummary.badges.map(badge => (
        <div 
          key={badge.type} 
          className={`flex flex-col items-center p-4 rounded-xl bg-[#1E1E1E] transition-all duration-300 ${
            badge.active ? 'opacity-100' : 'opacity-50'
          }`}
        >
          <div className="mb-2">
            <Image src={badge.image} alt={badge.type} className="w-8 h-8" />
          </div>
          <span className={
            theme === "dark" ? 'text-white' : 'text-black'
          }>
            {badge.type}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default AccountSummary;
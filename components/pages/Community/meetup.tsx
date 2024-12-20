// components/community/MeetupCard.tsx
'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface Company {
  name: string;
  logo: StaticImageData;
  state: string;
  country: string;
}

interface MeetupDate {
  month: string;
  day: string;
}

interface Meetup {
  title: string;
  date: MeetupDate;
  company: Company;
  tags: string[];
}

interface MeetupCardProps {
  meetup: Meetup;
  theme: string;
}

const MeetupCard: React.FC<MeetupCardProps> = ({ meetup, theme }) => (
  <div className="flex gap-4 py-4 border-b border-gray-700">
    <div className={`flex flex-col items-center p-2 min-w-[50px] h-fit rounded-lg ${
      theme === "dark" ? 'bg-slate-600' : 'bg-slate-200'
    }`}>
      <span className={`text-sm font-medium ${
        theme === "dark" ? 'text-white' : 'text-black'
      }`}>
        {meetup.date.month}
      </span>
      <span className={`text-lg font-bold ${
        theme === "dark" ? 'text-white' : 'text-black'
      }`}>
        {meetup.date.day}
      </span>
    </div>

    <div className="flex-1">
      <h4 className={`text-[14px] font-medium mb-2 ${
        theme === "dark" ? 'text-white' : 'text-black'
      }`}>
        {meetup.title}
      </h4>
      
      <div className="flex items-center gap-2 text-xs font-semibold mb-2">
        <Image 
          src={meetup.company.logo} 
          alt={meetup.company.name} 
          className="w-4 h-4"
        />
        <span className={
          theme === "dark" ? 'text-slate-500' : 'text-slate-500/20'
        }>
          {meetup.company.name}
        </span>
        <span className={
          theme === "dark" ? 'text-slate-500' : 'text-slate-500/20'
        }>
          {meetup.company.state}, {meetup.company.country}
        </span>
      </div>

      <div className="flex gap-2">
        {meetup.tags.map(tag => (
          <span key={tag} className="text-xs px-2 py-1 bg-gray-700 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default MeetupCard;
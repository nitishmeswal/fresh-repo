'use client';

import React from 'react';
import { FiHeart, FiMessageCircle, FiBookmark } from 'react-icons/fi';
import post1 from '@/public/pages/post-1.png';
import post2 from '@/public/pages/post-2.png';
import post3 from '@/public/pages/post-3.png';
import post4 from '@/public/pages/post-4.png';
import post5 from '@/public/pages/post-5.png';
import user1 from '@/public/pages/user1.png';
import user2 from '@/public/pages/user2.png';
import user3 from '@/public/pages/user3.png';
import Image from 'next/image';
import { useTheme } from 'next-themes';

function Community() {
  const { theme } = useTheme();
  const posts = [
    {
      id: 1,
      title: 'Blockchain developer best practices on innovation chain',
      author: {
        name: 'Peret Grey',
        avatar: user1,
        role: '1 week ago'
      },
      stats: {
        views: '89,324',
        likes: '26,565',
        comments: '56'
      },
      tags: ['#BTC', 'Block', 'Web3'],
      graph: post1
    },
    {
      id: 2,
      title: 'The 4-step SEO framework that led to a 1000% increase in traffic. Let\'s talk about blogging and SEO...',
      author: {
        name: 'Ali Juby',
        avatar: user2,
        role: '3 days ago'
      },
      stats: {
        views: '342,954',
        likes: '10,571',
        comments: '184'
      },
      tags: ['SEO', 'Blogging', 'Traffic'],
      graph: post2
    },
    {
      id: 3,
      title: 'OnePay - Online Payment Processing Web App - Download from ui8.net',
      author: {
        name: 'Mamunul Haque',
        avatar: user3,
        role: '1 week ago'
      },
      stats: {
        views: '670,606',
        likes: '29,751',
        comments: '209'
      },
      tags: ['payment', 'webapp', 'ui'],
      graph: post3
    },
    {
      id: 4,
      title: 'OnePay - Online Payment Processing Web App - Download from ui8.net',
      author: {
        name: 'Mamunul Haque',
        avatar: user1,
        role: '1 week ago'
      },
      stats: {
        views: '670,606',
        likes: '29,751',
        comments: '209'
      },
      tags: ['payment', 'webapp', 'ui'],
      graph: post4
    },
    {
      id: 5,
      title: 'OnePay - Online Payment Processing Web App - Download from ui8.net',
      author: {
        name: 'Mamunul Haque',
        avatar: user1,
        role: '1 week ago'
      },
      stats: {
        views: '670,606',
        likes: '29,751',
        comments: '209'
      },
      tags: ['payment', 'webapp', 'ui'],
      graph: post5
    },
    {
      id: 6,
      title: 'OnePay - Online Payment Processing Web App - Download from ui8.net',
      author: {
        name: 'Mamunul Haque',
        avatar: user3,
        role: '1 week ago'
      },
      stats: {
        views: '670,606',
        likes: '29,751',
        comments: '209'
      },
      tags: ['payment', 'webapp', 'ui'],
      graph: post5
    }
  ];

  const meetups = [
    {
      id: 1,
      date: { month: 'FEB', day: '7' },
      title: 'UIHUT - Crunchbase Company Profile...',
      tags: ['Remote', 'Full Time', 'Available'],
      company: {
        name: 'UIHUT - UI/UX Designer',
        logo: '/images/companies/uihut.png'
      }
    },
    {
      id: 2,
      date: { month: 'FEB', day: '3' },
      title: 'Design Meetups USA | Dribbble',
      tags: ['Remote', 'Full Time'],
      company: {
        name: 'Dribbble - Senior Designer',
        logo: '/images/companies/dribbble.png'
      }
    },
    {
      id: 3,
      date: { month: 'FEB', day: '5' },
      title: 'Meetup Brand Identity Design - Behi...',
      tags: ['Full Time', 'Contract', 'Available'],
      company: {
        name: 'Behance - Senior Designer',
        logo: '/images/companies/behance.png'
      }
    }
  ];

  return (
    <div className="community-container h-screen overflow-hidden ">
      <div className="posts-section overflow-y-auto ">
        {posts.map(post => (
          <div key={post.id} className="post-card bg-gray-950">
            <div className="post-content">
              {post.graph && (
                <div className="post-graph">
                  <Image src={post.graph} alt="Statistics" />
                </div>
              )}
              <div className="post-info">
                <h2 className={`post-title ${theme === 'light' ? 'text-white' : 'text-black'}`}>{post.title}</h2>
                <div className={`post-tags ${theme === 'light' ? ' text-green-400' : ' text-green-600'}`} >
                  {post.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="post-header">
                  <Image src={post.author.avatar} alt={post.author.name} className="author-avatar" />
                  <div className="author-info">
                    <h3 className={`post-title ${theme === 'light' ? 'text-white' : 'text-black'}`}>{post.author.name}</h3>
                    <div className={`${theme === 'light' ? ' text-green-400' : ' text-green-600'}`}>

                    <span >{post.author.role}</span>
                    </div>
                  </div>
                </div>
                <div className="post-stats">
                  <span className={` ${theme === 'light' ? ' text-green-400' : ' text-green-600'}`}>{post.stats.views} Views</span>
                  <span className={` ${theme === 'light' ? ' text-green-400' : ' text-green-600'}`}>{post.stats.likes} Likes</span>
                  <span className={` ${theme === 'light' ? ' text-green-400' : ' text-green-600'}`}>{post.stats.comments} comments</span>
                </div>
              </div>
            </div>
            <div className="post-actions">
              <button><FiHeart /></button>
              <button><FiMessageCircle /></button>
              <button><FiBookmark /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-right">
        <div className="account-summary">
          <h3>Account Summary</h3>
          <div className="profile-card">
            <img src="/images/avatars/profile.jpg" alt="Profile" className="profile-pic" />
            <div className="profile-info">
              <h4>Samantha Jeffery</h4>
              <div className="rating">
                <span className="score">4.3</span>
                <div className="stars">⭐⭐⭐⭐</div>
              </div>
            </div>
          </div>
          <div className="badges">
            <div className="badge gold active">
              <div className="badge-icon">
                <img src="/images/badges/gold.png" alt="Gold Badge" />
              </div>
              <span>Gold</span>
            </div>
            <div className="badge silver">
              <div className="badge-icon">
                <img src="/images/badges/silver.png" alt="Silver Badge" />
              </div>
              <span>Silver</span>
            </div>
            <div className="badge bronze">
              <div className="badge-icon">
                <img src="/images/badges/bronze.png" alt="Bronze Badge" />
              </div>
              <span>Bronze</span>
            </div>
          </div>
        </div>

        <div className="meetups">
          <div className="meetups-header">
            <h3>Meetups</h3>
            <button>View all</button>
          </div>
          {meetups.map(meetup => (
            <div key={meetup.id} className="meetup-card">
              <div className="date-badge">
                <span className="month">{meetup.date.month}</span>
                <span className="day">{meetup.date.day}</span>
              </div>
              <div className="meetup-info">
                <h4>{meetup.title}</h4>
                <div className="company-info">
                  <img src={meetup.company.logo} alt={meetup.company.name} />
                  <span>{meetup.company.name}</span>
                </div>
                <div className="tags">
                  {meetup.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Community; 
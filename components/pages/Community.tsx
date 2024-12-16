  'use client';

  import React from 'react';
  import { FiHeart, FiMessageCircle, FiBookmark } from 'react-icons/fi';
  import Image from 'next/image';
  import { useTheme } from 'next-themes';
  import { LandingRating } from '../ui/rating';
  import { accountSummary, meetups, posts } from '@/utils/constant';

  function Community() {
    const { theme } = useTheme();

    return (
      <div className="community-container w-full px-4 py-6 h-screen overflow-hidden ">
        <div className="posts-section w-[52vw] overflow-y-auto ">
          {posts.map(post => (
            <div key={post.id}  className={`mr-4 post-card relative
                                ${theme === 'dark' ? ' bg-gray-100' :  'bg-gray-950' } `}>
              <div className="post-content relative">
                {post.graph && (
                  <div className="post-graph">
                    <Image src={post.graph} alt="Statistics" />
                  </div>
                )}
                <div className="post-info  relative">
                  <h2 className={`post-title 
                      ${theme === 'light' ? 'text-white' : 'text-black'}`}>{post.title}</h2>
                  <div className={`post-tags 
                      ${theme === 'light' ? ' text-green-400' : ' text-green-600'}`} >
                    {post.tags.map(tag => (
                      <span key={tag} className={`tag rounded-3xl
                                      ${ theme === 'dark' ? ' bg-slate-300' : 'bg-[#2C353D]'}`}>{tag}</span>
                    ))}
                  </div>
                  <div className="post-header">
                    <Image src={post.author.avatar} alt={post.author.name} className="author-avatar" />
                    <div className="author-info">
                      <h3 className={`post-title 
                          ${theme === 'light' ? 'text-white' : 'text-black'}`}>{post.author.name}</h3>
                      <div className={`${theme === 'light' ? ' text-green-400' : ' text-green-600'}`}>

                      <span >{post.author.role}</span>
                      </div>
                    </div>
                  </div>
                  <div className="post-stats right-2">
                    <span className={` ${theme === 'light' ? ' text-green-400' : ' text-green-600'}`}
                                    >{post.stats.views} Views</span>
                    <span className={` ${theme === 'light' ? ' text-green-400' : ' text-green-600'}`}>
                                    {post.stats.likes} Likes
                                    </span>
                    <span className={` ${theme === 'light' ? ' text-green-400' : ' text-green-600'}`}>
                                  {post.stats.comments} comments
                                    </span>
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

        <div className="sidebar-right ">
          <div className={`account-summary px-4 ${theme === 'dark' ? 'bg-gray-100' : 'bg-gray-950'}`}>
            <h3>Account Summary</h3>
            <div className="profile-card">
              <Image src={accountSummary.image} alt="Profile" className="profile-pic" />
              <div className="profile-info">
                <h4 className={` ${theme === 'light' ? 'text-white' : 'text-black'}`}>{accountSummary.name}</h4>
                <div className="rating">
                  <span className={`core ${theme === 'light' ? 'text-white' : 'text-black'}`}>{accountSummary.rating}</span>
                  <LandingRating rating={4.3} />
                </div>
              </div>
            </div>

            <div className="badges">
              {
                accountSummary.badges.map(badge => (
                  <div key={badge.type} className={`badge ${badge.active ? 'active' : ''}`}>
                    <div className="badge-icon">
                      <Image src={badge.image} alt={badge.type} />
                    </div>
                    <span className={theme === 'light' ? ' text-black' : ' text-white'}>{badge.type}</span>
                  </div>
                ))
              }
            </div>
          </div>

          <div className={`meetups ${theme === 'dark' ? 'bg-gray-100' : 'bg-gray-950'}`}>
            <div className="meetups-header">
              <h3 className={`${theme === 'light' ? 'text-white' : 'text-black'}`}>Meetups</h3>
              <button className={`${theme === 'light' ? 'text-white' : 'text-black'}`}>View all</button>
            </div>
            {meetups.map(meetup => (
              <div key={meetup.id} className="meetup-card">
                <div className={`date-badge ${theme === 'light' ? ' bg-slate-600' : ' bg-slate-200'}`}>
                  <span className={`month ${theme === 'light' ? 'text-white' : 'text-black'}`}>
                            {meetup.date.month}
                            </span>
                  <span className={`day ${theme === 'light' ? 'text-white' : 'text-black'}`}>
                            {meetup.date.day}
                            </span>
                </div>
                <div className="meetup-info w-full">
                  <h4 className={`${theme === 'light' ? 'text-white' : 'text-black'} text-[14px]`}>{meetup.title}</h4>
                  <div className={` ${theme === 'light' ? ' text-slate-500' : ' text-slate-500/20'} company-info text-xs font-semibold` }>
                    <Image src={meetup.company.logo} alt={meetup.company.name} />
                    <span >{meetup.company.name}</span>
                    <span >{meetup.company.state}, {meetup.company.country}</span>
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
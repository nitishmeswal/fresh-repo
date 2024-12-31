"use client"

import React, { ReactNode, useRef } from 'react';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { name: 'Account Info', link: '/' },
  { name: 'Connections', link: 'connections' },
  { name: 'Auth & Security', link: 'auth-security' },
  { name: 'Email Management', link: 'email-management' },
  { name: 'External Account', link: 'external-account' },
  { name: 'Session Mgmt', link: 'session-mgmt' },
  { name: 'Notifications', link: 'notifications' },
  { name: 'Privacy', link: 'privacy' },
  { name: 'Danger Zone', link: 'danger-zone' }
];

const Layout = ({ children }: { children: ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const currentPath = usePathname();
  console.log(currentPath.slice(9));
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className='flex flex-col px-8 bg-black justify-center items-center'>
      <div className='relative flex items-center w-full max-w-5xl pt-6'>
        {/* Left Scroll Button */}
        {/* <button
          onClick={() => scroll('left')}
          className='absolute left-0 z-10 bg-gray-900/80 p-2 rounded-full hover:bg-gray-700'
        >
          <ChevronLeft className='w-6 h-6 text-white' />
        </button> */}

        <div
          ref={scrollRef}
          className='flex w-full overflow-x-auto scrollbar-hide scroll-smooth items-center'
        >
          <div className='flex items-center space-x-4 bg-gray-950 py-2 px-8 whitespace-nowrap'>
            {menuItems.map((item, index) => (
              <div key={index} className='flex items-center pb-4'>
                <span
                  onClick={() => router.push(`/settings/${item.link}`)}
                  className={`
                    px-4 py-2 rounded-xl cursor-pointer
                    hover:bg-gray-800
                    ${currentPath.slice(9) === `/${item.link}` ? 'bg-blue-600 text-white' : ''}
                  `}
                >
                  {item.name}
                </span>
                {index < menuItems.length - 1 && (
                  <Separator orientation="vertical" className="mx-4 h-6" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Scroll Button */}
        {/* <button
          onClick={() => scroll('right')}
          className='absolute right-0 z-10 bg-gray-900/80 p-2 rounded-full hover:bg-gray-700'
        >
          <ChevronRight className='w-6 h-6 text-white' />
        </button> */}
      </div>

      <div className='flex-1 w-full max-w-5xl '>
        {children}
      </div>
    </div>
  );
};

export default Layout;

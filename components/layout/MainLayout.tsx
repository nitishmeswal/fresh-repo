'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search, Wallet, Settings, LayoutDashboard, Cpu, Brain, Coins, Users, Info } from 'lucide-react';
import Image from 'next/image';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'GPU Marketplace', href: '/marketplace', icon: Cpu },
  { name: 'AI Models', href: '/ai-models', icon: Brain },
  { name: 'Earnings', href: '/earnings', icon: Coins },
  { name: 'Connect to Earn', href: '/connect-earn', icon: Cpu },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'More info', href: '/info', icon: Info },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
              <span className="text-xl font-bold text-white">Compute</span>
            </Link>

            {/* Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search for something"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </button>

            {/* Cost Display */}
            <div className="hidden md:flex items-center space-x-2 text-gray-400">
              <span>0 items</span>
              <span className="text-white font-medium">$0/hr</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-gray-900/50 backdrop-blur-xl border-r border-gray-800">
        <nav className="h-full py-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 mx-2 rounded-lg ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-16 pl-64">
        {children}
      </main>
    </div>
  );
}

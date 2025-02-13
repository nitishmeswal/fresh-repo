'use client';

import "./globals.css";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';
import { signOut } from '@/lib/supabase';
import Script from 'next/script';
import { Bell, Search, Wallet, Settings, LayoutDashboard, Cpu, Brain, Coins, Users, Info, LogOut, User, Sparkles, Network } from 'lucide-react';
import { ThemeProvider } from "next-themes";
import { Providers } from "@/components/providers";
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "@/components/page-transition";
import { useRouter } from 'next/navigation';
import { LockIcon } from '@/components/LockIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Compute', href: '/gpu-marketplace', icon: Cpu, isNew: true },
  { name: 'AI Models', href: '/ai-models', icon: Brain, isNew: true },
  { name: 'AI Agents', href: '/ai-agents', icon: Sparkles, isLocked: true },
  { name: 'Earnings', href: '/earnings', icon: Coins, isLocked: true },
  { name: 'Connect to Earn', href: '/connect-to-earn', icon: Network, isLocked: true },
  { name: 'Wallet', href: '/wallet', icon: Wallet, isLocked: true },
  { name: 'Community', href: '/community', icon: Users, isLocked: true },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'More info', href: '/more-info', icon: Info },
];

const localInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${localInter.variable}`}
      data-sidebar-collapsed={isSidebarCollapsed}
    >
      <head>
        <Script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen bg-black font-sans antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          <Providers>
            <MainLayout isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed}>
              {children}
            </MainLayout>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

function MainLayout({ 
  children,
  isSidebarCollapsed,
  setIsSidebarCollapsed
}: { 
  children: React.ReactNode;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState('');
  const router = useRouter();
  const { user, loading } = useUser();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Don't show sidebar and header on the sign-in page
  const isSignInPage = pathname === '/';
  if (isSignInPage) {
    return <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">{children}</div>;
  }
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black grid-background">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-800 glass">
        <div className="px-8 h-20 flex items-center justify-between">
          <div className="flex items-center flex-1 space-x-12">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img src="/neurolov-logo.svg" alt="Neurolov" className="h-8" />
            </Link>

            {/* Search */}
            <div className="relative flex-1 hidden md:block max-w-3xl">
              <input
                type="text"
                placeholder="Search for something"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 px-5 py-2 bg-white/5 rounded-lg text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#40A6FF] glass text-lg"
              />
              <Search className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-3 hover:bg-white/5 rounded-lg glass glow">
              <Bell className="h-6 w-6 text-gray-400" />
            </button>

            {/* Profile Dropdown - Only show when logged in */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 hover:bg-white/5 rounded-lg glass glow">
                  <User className="h-6 w-6 text-gray-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-black/90 backdrop-blur-xl border border-white/10">
                  <DropdownMenuItem 
                    className="text-gray-300 hover:text-white focus:text-white cursor-pointer"
                    onClick={() => router.push('/auth/profile')}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-gray-300 hover:text-white focus:text-white cursor-pointer"
                    onClick={handleLogout}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-screen pt-20">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-20 h-[calc(100vh-5rem)] ${isSidebarCollapsed ? 'w-20' : 'w-64'} border-r border-gray-800 glass transition-all duration-300 z-50`}>
          {/* Collapse Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-5 p-1.5 bg-gray-800 rounded-full border border-gray-700 hover:bg-gray-700 transition-colors z-50"
          >
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <nav className="h-full px-4 py-5">
            <div className="space-y-1.5">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center justify-between px-4 py-3.5 text-base font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!isSidebarCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isSidebarCollapsed && item.isNew && (
                      <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
                        New
                      </span>
                    )}
                    {!isSidebarCollapsed && item.isLocked && (
                      <LockIcon />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
          <div className="h-full">
            <AnimatePresence mode="wait">
              <PageTransition key={pathname}>
                {/* Removed ComingSoonWrapper as we now handle overlays in individual components */}
                {children}
              </PageTransition>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RootLayout;
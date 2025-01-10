import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header";
import CustomSidebar from "@/components/sidebar";
import { SupabaseProvider } from "@/lib/supabase/supabase-provider";
import { CreditsProvider } from '@/contexts/credits-context';
import { UserProvider } from '@/contexts/user-context';
import { SearchFilterProvider } from '@/contexts/search-filter-context';
import { Providers } from "@/components/providers";
import { Toaster } from 'react-hot-toast';

const localInter = localFont({
  src: "./fonts/Inter_Regular.ttf",
  variable: "--font-inter",
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${localInter.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <SupabaseProvider>
          <UserProvider>
            <CreditsProvider>
              <SearchFilterProvider>
                <Providers>
                  <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />
                      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000" />
                    </div>

                    {/* Layout Structure */}
                    <div className="relative flex flex-grow">
                      {/* Sidebar */}
                      <aside className="hidden lg:block w-64 fixed left-0 top-0 bottom-0 bg-sidebar border-r border-gray-200 dark:border-gray-800">
                        <CustomSidebar />
                      </aside>

                      {/* Main Content */}
                      <div className="flex-1 lg:ml-64">
                        {/* Header */}
                        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
                          <Header />
                        </header>

                        {/* Page Content */}
                        <div className="p-6">
                          {children}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Toaster position="top-center" />
                </Providers>
              </SearchFilterProvider>
            </CreditsProvider>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
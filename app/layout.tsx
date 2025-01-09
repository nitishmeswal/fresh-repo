'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "next-themes";
import CustomSidebar from "@/components/sidebar";
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { SupabaseProvider } from "@/lib/supabase/supabase-provider";
import { CreditsProvider } from '@/contexts/credits-context';
import { UserProvider } from '@/contexts/user-context';
import { SearchFilterProvider } from '@/contexts/search-filter-context';
import { Toaster } from 'sonner';
import { ToastProvider } from "@/components/ui/use-toast";

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
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${localInter.variable}`}
    >
      <body
        className={`
          min-h-screen
          bg-background
          font-sans
          antialiased
        `}
      >
        <SupabaseProvider>
          <UserProvider>
            <CreditsProvider>
              <SearchFilterProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  disableTransitionOnChange
                >
                  <ToastProvider>
                    <div className="relative min-h-screen flex">
                      {!isLoginPage && (
                        <div className="w-64 flex-shrink-0">
                          <CustomSidebar />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col">
                        {!isLoginPage && <Header />}
                        <main className={`flex-1 ${!isLoginPage ? 'pt-16' : ''}`}>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={pathname}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 20 }}
                              transition={{ duration: 0.3 }}
                              className="min-h-full"
                            >
                              {children}
                            </motion.div>
                          </AnimatePresence>
                        </main>
                      </div>
                    </div>
                    <Toaster position="top-center" />
                  </ToastProvider>
                </ThemeProvider>
              </SearchFilterProvider>
            </CreditsProvider>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import CustomSidebar from "@/components/sidebar";
import { CartProvider } from "@/context/useCart";
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

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
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <CartProvider>
              <div className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                
                {/* Animated gradient orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />
                  <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000" />
                </div>

                {/* Page transitions */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div className="flex flex-col w-full">
                      {/* Header is always at the top */}
                      <nav className="flex w-full">
                        <Header />
                      </nav>
                      <div className="h-[1px] w-full bg-gray-250"></div>
                      {/* Sidebar and content */}
                      <div className="flex flex-row flex-1">
                        <div className="bg-gray-950/10 max-h-full">
                          <CustomSidebar />
                        </div>
                        <div className="h-full w-0 dark:w-[0.5px] opacity-0 dark:opacity-100 dark:bg-black"></div>
                        <main className="flex-1 bg-transparent">
                          {children}
                        </main>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </CartProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
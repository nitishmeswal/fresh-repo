"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Loader, Moon, Sun, Bell, User, LogIn } from 'lucide-react'; 
import logoNight from "@/public/logo-night.svg";
import logo from "../public/logo.svg";
import { useEffect, useState } from "react";
import ProfileDropdown from "./profile-dropdown";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "./ui/button";
import { useUser } from "@/contexts/user-context";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from 'next/navigation';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [load, setLoad] = useState(false);
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    setLoad(true);
  }, []);

  if (!load) return <Loader />;

  const handleThemeChange = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="w-full h-16 fixed top-0 z-50">
      <div className={`
        w-full h-full
        ${theme === "dark" ? "bg-gray-950/80" : "bg-white/80"}
        backdrop-blur-md border-b
        ${theme === "dark" ? "border-gray-800" : "border-gray-200"}
        px-4 lg:px-8
        flex items-center
        justify-between
      `}>
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            {theme === "dark" ? (
              <Image src={logo} alt="logo" width={120} height={32} />
            ) : (
              <Image src={logoNight} alt="logo" width={120} height={32} />
            )}
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeChange}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Bell className="h-5 w-5" />
          </Button>

          {!user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/login'}
              className="bg-black/50 border-white/10 hover:bg-white/10 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity" />
              <LogIn className="mr-2 h-4 w-4" />
              <span>Login</span>
            </Button>
          ) : (
            <ProfileDropdown />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
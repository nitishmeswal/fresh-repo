"use client"

import { Loader, LogIn, LogOut, Settings, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react'
const [showDropdown, setShowDropdown] = useState<boolean>(false);
const { theme, setTheme } = useTheme();
const dropdownRef = useRef<HTMLDivElement>(null);
const buttonRef = useRef<HTMLImageElement>(null);
// import loggedIn from "../public/loggedin.svg";

const router = useRouter();
const {data:session, status} = useSession();

const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();
const userIamge = session?.user?.image;


const Signed = () => {

    const handleSignOut = async ()=> {

        await signOut({
            redirect: false,
        });
        router.push("/")
    }
    if(status === "loading") return (
            <Loader className="size-6 mr-4 mt-4 float-right animate-spin" />
        )
    


    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (
          dropdownRef.current && 
          buttonRef.current && 
          !dropdownRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setShowDropdown(false);
        }
      }, []);
    
      useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [handleClickOutside]);

      const dropdownItems = [
        { 
          icon: <User className="mr-2 h-4 w-4" />, 
          text: "Profile", 
          onClick: () => {} 
        },
        { 
          icon: <Settings className="mr-2 h-4 w-4" />, 
          text: "Settings", 
          onClick: () => {} 
        },
      ];


  return (
    <div className="relative">
    <Image
      ref={buttonRef}
      src={userIamge || avatarFallback! }
      alt="loggedIn"
      className="w-15 cursor-pointer"
      onClick={() => setShowDropdown((prev) => !prev)} 
    />
    {showDropdown && (
      <div
        ref={dropdownRef}
        className={`absolute top-full right-0 mt-2 w-60 rounded-lg shadow-lg z-50 ${
          theme === 'dark' 
            ? "bg-gray-100 text-gray-900" 
            : "bg-gray-950 text-gray-100"
        }`}
      >
        <div
          className={`px-4 py-3 border-b ${
            theme === 'dark' 
              ? "border-gray-300 text-gray-800" 
              : "border-gray-700 text-gray-100"
          } text-center font-semibold`}
        >
          Welcome to Neurolov
        </div>

        <div className="py-1">
          { status === 'authenticated' ? 
          <div
              className={`px-4 py-2 flex items-center cursor-pointer hover:${
                theme === 'dark' 
                  ? "bg-gray-200" 
                  : "bg-gray-800"
              }`}
              onClick={() => {
                handleSignOut();
                setShowDropdown(false);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Signout</span>
            </div>
             : dropdownItems.map((item, index) => (
            <div
              key={index}
              className={`px-4 py-2 flex items-center cursor-pointer hover:${
                theme === 'dark' 
                  ? "bg-gray-200" 
                  : "bg-gray-800"
              }`}
              onClick={() => {
                item.onClick();
                setShowDropdown(false);
              }}
            >
              {item.icon}
              <span>{item.text}</span>
            </div>

          ))}
          {
              <a href={`sign-in`} className={`w-full px-4 py-2 flex items-center flex-row cursor-pointer hover:${
              theme === 'dark' 
                ? "bg-gray-200" 
                : "bg-gray-800"
            }`}>
                <LogIn className="mr-2 h-4 w-4" />
                <span>
                  Sign In
                </span>
              </a>
          }
        </div>
      </div>
    )}
  </div>
  )
}

export default Signed

"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { Moon, Sun, LogOut, Settings, User, LogIn } from 'lucide-react'; // implement the logout and login signUp module here.
import { LoginModal } from "@/components/modals/loginModals";

import logo from "../public/logo.svg";
import search from "../public/search.svg";
import bell from "../public/bell.svg";
import loggedIn from "../public/loggedin.svg";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLImageElement>(null);

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
    <>
      <div
        className={`${
          theme === 'dark'
            ? "bg-white text-gray-950 border-b border-gray-300"
            : "bg-gray-950 text-gray-300"
        } flex w-full items-center px-10 py-2 text-lg h-[13vh]`}
      >
        <div className="flex flex-row justify-between w-full items-center">
          <div id="logo" className="flex flex-wrap justify-center mr-10 items-center">
            <Link href="/">
              <Image src={logo} alt="logo" height={30} />
            </Link>
          </div>

          <div
            className={`w-[60%] flex flex-row items-center ${
              theme === 'dark'
                ? "bg-gray-200 text-gray-900"
                : "bg-black text-gray-300"
            } rounded-full ml-4 mr-8 px-4 py-2`}
          >
            <Image src={search} alt="search" height={6} width={6} className="w-6" />
            <input
              type="text"
              className={`w-full focus:border-none focus:outline-none mx-4 ${
                theme === 'dark' ? "bg-gray-200" : "bg-black"
              }`}
              placeholder="Search for something" 
            />
          </div>

          <div className="flex justify-between flex-row items-center mr-8">
            <div className="flex flex-row items-center justify-start relative">
              <div
                className={`flex rounded-full p-3 ${
                  theme === 'dark' ? "bg-gray-200" : "bg-white"
                } mr-8`}
              >
                <Image
                  src={bell}
                  alt="bell"
                  className={`h-13 hover:cursor-pointer ${theme === 'dark' ? 
                    "text-gray-900" : "text-gray-950"}`}
                />
              </div>
              
              <div className="relative">
                <Image
                  ref={buttonRef}
                  src={loggedIn}
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
                      {dropdownItems.map((item, index) => (
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
            </div>
            <button 
              className="flex border-none rounded p-2 bg-transparent absolute right-2" 
              onClick={() => {
                // localStorage.setItem('theme', theme || "dark")
                setTheme(theme === 'light' ? 'dark' : 'light')}
              }
            >
              {theme === 'light' ? (
                <Sun className="w-6 h-6 rotate-0 scale-100 transition-all duration-150" />
              ) : (
                <Moon className="w-6 h-6 hover:border-slate-100 rotate-0 scale-100 transition-all duration-150" />
              )}
            </button>
          </div>
        </div>
      </div>

      <LoginModal />
    </>
  );
};

export default Header;
"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { Moon, Sun } from 'lucide-react';
import { LoginModal } from "@/components/modals/loginModals";
import useLoginModal from "@/hooks/useLoginModal";

import logo from "../public/logo.svg";
import search from "../public/search.svg";
import bell from "../public/bell.svg";
import loggedIn from "../public/loggedin.svg";



const Header = () => {
  const loginModalHooks = useLoginModal();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const { theme,setTheme} = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      <div
        className={`${
          theme == 'dark'
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
                theme == 'dark'
                  ? "bg-gray-200 text-gray-900"
                  : "bg-black text-gray-300"
              } rounded-full ml-4 mr-8 px-4 py-2`}
              >
              <Image src={search} alt="search" height={6} width={6} className="w-6" />
              <input
                type="text"
                className={`w-full focus:border-none focus:outline-none mx-4 ${
                  theme == 'dark' ? "bg-gray-200" : "bg-black"
                }`}
                placeholder="Search for something" 
              />
            </div>

            <div className="flex justify-between flex-row items-center mr-8">
              <div className="flex flex-row items-center justify-start">
                  <div
                    className={`flex rounded-full p-3 ${
                      theme == 'dark' ? "bg-gray-200" : "bg-white"
                    } mr-8`}
                  >
                    <Image
                      src={bell}
                      alt="bell"
                      className={`h-13 hover:cursor-pointer ${theme == 'dark' ? "text-gray-900" : "text-gray-950"}`}
                    />
                  </div>
                  
                  <div
                    className={`flex items-center rounded-full ${
                      theme == 'dark' ? "bg-gray-200" : "bg-white"
                    } cursor-pointer`}
                    ref={dropdownRef}
                  >
                    <Image
                      src={loggedIn}
                      alt="loggedIn"
                      className="w-15"
                      onClick={() => setShowDropdown((prev) => {
                        console.log(prev)
                        return !prev})} // Toggle dopdown on click
                    />
                  </div>
                {showDropdown && (
                  <div
                    className={`absolute top-full right-0 mt-2 w-60 rounded-lg shadow-lg z-50 ${
                      theme == 'dark' ? "bg-gray-100 text-gray-900" : "bg-gray-950 text-gray-100"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 ${
                        theme == 'dark' ? "text-gray-950" : "text-gray-100"
                      } cursor-pointer flex justify-center`}
                    >
                      Welcome to Neurolov
                    </div>
                    
                    <div className="flex justify-between mt-2 ">
                      <button
                        className={`px-4 py-2 border-none w-fit ${
                          theme == 'dark'
                            ? "text-white hover:bg-gray-800"
                            : "text-gray-950 hover:bg-gray-800 hover:text-white "
                        } cursor-pointer`}
                        onClick={loginModalHooks.onOpen}
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button className=" flex border-none rounded p-2 bg-transparent absolute right-2" 
                      onClick={
                            ()=> {
                              console.log(theme)
                              return setTheme(theme === 'light' ? 'dark' : 'light')
                            }}
                      >
               {theme === 'light' ? (
                  <Sun className="w-6 h-6 rotate-0 scale-100 transition-all duration-150" />
                ) : (
                  <Moon className="w-6 h-6 hover:border-slate-100 bg-gray-850 rotate-0 scale-100 transition-all duration-150" />
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

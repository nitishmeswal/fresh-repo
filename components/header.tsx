"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

import logo from "../public/logo.svg";
import search from "../public/search.svg";
import bell from "../public/bell.svg";
import loggedIn from "../public/loggedin.svg";

import { LoginModal } from "@/components/modals/loginModals";
import useLoginModal from "@/hooks/useLoginModal";
import { useThemeContext } from "@/context/theme";
import DarkButton from "./modals/darkMode";

const Header = () => {
  const loginModalHooks = useLoginModal();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const { handleTheme, lightTheme } = useThemeContext();

  // Close dropdown when clicking outside
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
      {/* Header */}
      <div className="flex w-full items-center bg-gray-950 px-10 py-2 text-lg h-[13vh]">
        <div className="flex flex-row justify-evenly w-full items-center">
          {/* Logo */}
          <div id="logo" className="flex justify-center mr-16 items-center">
            <Link href="/">
              <Image src={logo} alt="logo" height={42} />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="w-full flex flex-row items-center bg-black rounded-full mx-4 mr-10 px-4 py-2">
            <Image src={search} alt="search" height={6} width={6} className="w-6" />
            <input
              type="text"
              className="w-[80%] bg-black text-gray-300 ml-6"
              placeholder="Search for something"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex justify-center items-center mx-4 my-2">
          {/* Bell Icon */}
          <div className="flex rounded-full p-3 bg-white mr-8">
            <Image src={bell} alt="bell" className="w-8" />
          </div>

          {/* Profile/LoggedIn Section */}
          <div
            className="relative flex items-center rounded-full bg-white cursor-pointer"
            ref={dropdownRef}
          >
            <Image
              src={loggedIn}
              alt="loggedIn"
              className="w-[72px]"
              onClick={() => setShowDropdown((prev) => !prev)} // Toggle dropdown on click
            />

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-lg shadow-lg py-4 z-50">
                {/* Dropdown Header */}
                <div className="px-4 py-2 text-gray-950 hover:bg-gray-100 cursor-pointer">
                  Welcome to Neurolov
                </div>

                {/* Actions */}
                <div className="flex justify-between px-4 mt-2">
                  <button
                    className="px-4 py-2 border-none w-fit rounded-full bg-gray-950 text-gray-100 hover:bg-gray-800 cursor-pointer"
                    onClick={loginModalHooks.onOpen}
                  >
                    Sign In
                  </button>
                  <DarkButton handler={handleTheme} currentTheme={lightTheme} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal />
    </>
  );
};

export default Header;

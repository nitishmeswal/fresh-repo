"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Loader, Moon, Sun} from 'lucide-react'; // implement the logout and login signUp module here.
// import { LoginModal } from "./modals/loginModals";
import logoNight from "@/public/logo-night.svg";
import logo from "../public/logo.svg";
import search from "../public/search.svg";
import bell from "../public/bell.svg";
import Signed from "./auth/signed-in";
import { useEffect, useState } from "react";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [ load, setLoad ] = useState(false);

  useEffect(()=> {
    setLoad(true);
  })
  
  if(!load) return <Loader></Loader>;

  return (
    <>
      <div
        className= {`${
          theme === "dark"
          ? "bg-gray-950 text-gray-300"
          : "bg-white text-gray-950 border-b border-gray-300"
        } flex w-full items-center px-10 py-2 text-lg h-[13vh]`}
      >
        <div className="flex flex-row justify-between w-full items-center">
          <div id="logo" className="flex flex-wrap justify-center mr-10 items-center">
            <Link href="/">
            {
              theme === "dark"
              ? <Image src={logo} alt="logo" />
              : <Image src={logoNight} alt="logo" className="w-56"/>
            }
            </Link>
          </div>

          <div
            className={`w-[60%] flex flex-row items-center ${
              theme === "dark"
              ? "bg-black text-gray-300"
              : "bg-gray-200 text-gray-900"
            } rounded-full ml-4 mr-8 px-4 py-2`}
          >
            <Image src={search} alt="search" height={6} width={6} className="w-6" />
            <input
              type="text"
              className={`w-full focus:border-none focus:outline-none mx-4 ${
                theme === "dark" ?
                 "bg-black" :
                 "bg-gray-200"
              }`}
              placeholder="Search for something" 
            />
          </div>

          <div className="flex justify-between flex-row items-center mr-8">
            <div className="flex flex-row items-center justify-start relative">
              <div
                className={`flex rounded-full p-3 ${
                  theme === "dark" ? 
                   "bg-white" :
                  "bg-gray-200"
                } mr-8`}
              >
                <Image
                  src={bell}
                  alt="bell"
                  className={`h-13 hover:cursor-pointer ${theme === '' ? 
                    "text-gray-900" : "text-gray-950"}`}
                />
              </div>

              <Signed/>
            </div>
            <button 
              className="flex border-none rounded p-2 bg-transparent absolute right-2" 
              onClick={() => {
                // localStorage.setItem('theme', theme || "dark")
                console.log("current theme is", theme)
                setTheme(theme === "dark" ? 'light' : "dark")
                
              }
              }
            >
              {theme === "dark" ? (
                <Sun className="w-6 h-6 rotate-0 scale-100 transition-all duration-150" />
              ) : (
                <Moon className="w-6 h-6 hover:border-slate-100 rotate-0 scale-100 transition-all duration-150" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* <LoginModal /> */}
    </>
  );
};

export default Header;
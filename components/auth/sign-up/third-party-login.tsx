"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
export const SocialSignInButtons: React.FC<{ 
  isLoading: boolean, 
}> = ({ isLoading}) => {
  const {theme} = useTheme();
  
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleGithubSignIn = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  const getButtonClasses = (baseClasses: string) => 
    `${baseClasses} ${theme === "dark" 
      ? 'border-gray-700 hover:bg-gray-700 text-black' 
      : 'border-gray-300 hover:bg-gray-200 text-white'}`;

  return (
    <>
      <div className="flex items-center flex-col justify-center my-4">
        <hr className={`w-full border-t ${theme === "dark" ? 'border-gray-700' : 'border-gray-300'}`} />
        <span className={`
          px-3 
          ${theme === "dark" ? 'text-gray-450 bg-gray-850' : 'text-gray-600 bg-gray-100'}
        `}>
          Or continue with
        </span>
        <hr className={`w-full border-t ${theme === "dark" ? 'border-gray-700' : 'border-gray-300'}`} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={getButtonClasses("w-full")}
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
        </Button>
          
        <Button 
          variant="outline"
          type="button"
          onClick={handleGithubSignIn}
          disabled={isLoading}
          className={getButtonClasses("w-full")}
        >
          <AiFillGithub className="mr-2 h-5 w-5" />
          GitHub
        </Button>
      </div>
    </>
  );
};
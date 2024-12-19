"use client"

import React from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
const SignUpRedirect = () => {
    const { theme } = useTheme()
  return (
    <div className="text-center">
        <p className={`
          text-sm 
          ${theme === "dark" ? 'text-gray-450' : 'text-gray-600'}
        `}>
          Already have an account?{" "}
          <Link
            href="/sign-in" 
            className={`
              font-semibold 
              ${theme === "dark" 
                ? 'text-blue-600 hover:text-blue-500' 
                : 'text-blue-500 hover:text-blue-600'}
            `}
          >
            Log in
          </Link>
        </p>
      </div>

  )
}

export default SignUpRedirect

"use client"
import Image from "next/image"
import logo from "@/public/logo.svg"
import { useTheme } from "next-themes"
import ThemedStyles from "@/utils/theme-color"
export const LoginHeader = () => {

  const { theme } = useTheme()
  const { textColor, subtextColor } = ThemedStyles(theme)
  return (
  <div className="flex flex-col items-center">
    <Image 
      src={logo} 
      alt="Logo" 
      height={40} 
      className="mb-6"
    />
    <h2 className={`
      text-3xl font-semibold tracking-tight
      ${textColor}
    `}>
      Welcome back
    </h2>
    <p className={`
      mt-2 text-sm
      ${subtextColor}
      `}>
      Login to continue your journey
    </p>
  </div>
  )
}
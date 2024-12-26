"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import Link from "next/link"

import { SocialLogin } from "@/components/auth/third-party-login"
import Divider from "@/components/auth/divider"
import { LoginForm } from "@/components/auth/sign-in/login-form"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSocialLoginStart = () => {
    setIsLoading(true)
  }

  const handleSocialLoginSuccess = () => {
    setIsLoading(false)
    router.push("/dashboard")
    router.refresh()
  }

  const handleSocialLoginError = () => {
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen -mt-20">
      <Card className="w-full sm:w-96 mx-auto mt-10 ">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <SocialLogin 
                  isLoading={isLoading}
                  onLoginStart={handleSocialLoginStart}
                  onLoginSuccess={handleSocialLoginSuccess}
                  onLoginError={handleSocialLoginError}
                />
          <Divider />
          <LoginForm />
        </CardContent>
        <CardFooter>
          <p className="text-sm texgr">
            Don&apos;t have an account? <Link href="/sign-up" className="underline">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

          
"use client"
import { SignupForm } from "@/components/auth/sign-up/signup-form";
// import { pageBackground, textColor } from "@/utils/theme-color";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SocialLogin } from "@/components/auth/third-party-login";
import Divider from "@/components/auth/divider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // const { theme } = useTheme()

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
    <Card className="w-full sm:w-96 mx-auto mt-10">
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
      <SignupForm />
    </CardContent>
    <CardFooter>
      <p className="text-sm">
      Already have an account? <Link href="/sign-in" className="underline">Sign up</Link>
      </p>
    </CardFooter>
  </Card>
  );
}
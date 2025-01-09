"use client";

import { SignupForm } from "@/components/auth/sign-up/signup-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SocialLogin from "@/components/auth/third-party-login";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black p-4">
      <Card className="w-full max-w-md bg-black/50 backdrop-blur-xl border-white/10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SocialLogin />
        </CardContent>
      </Card>
    </div>
  );
}
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AiFillGithub } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/inputs/input"
import Link from "next/link"
import Image from "next/image"
import logo from "@/public/logo.svg"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleOnSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false)
      if (callback?.ok) {
        toast.success("Logged in successfully")
        router.push("/dashboard")
        router.refresh()
      }
      if (callback?.error) {
        toast.error(callback.error)
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Image 
            src={logo} 
            alt="Logo" 
            width={80} 
            height={80} 
            className="mb-6"
          />
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Login to continue your journey
          </p>
        </div>
        
        <form 
          onSubmit={handleSubmit(handleOnSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <Input
              id="email"
              label="Email Address"
              type="email"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>

          <div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Continue'}
            </Button>
          </div>

          <div className="flex items-center justify-center my-4">
            <hr className="w-full border-t border-muted" />
            <span className="px-3 text-muted-foreground bg-background">Or continue with</span>
            <hr className="w-full border-t border-muted" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline"
              type="button"
              onClick={() => signIn('google')}
              disabled={isLoading}
              className="w-full"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Google
            </Button>

            <Button 
              variant="outline"
              type="button"
              onClick={() => signIn('github')}
              disabled={isLoading}
              className="w-full"
            >
              <AiFillGithub className="mr-2 h-5 w-5" />
              GitHub
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link 
                href="/sign-up" 
                className="font-semibold text-primary hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
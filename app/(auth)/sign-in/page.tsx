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
import { useTheme } from "next-themes"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { theme } = useTheme()

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
    <div className={`
      flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8
      ${theme === 'light' ? 'bg-gray-850' : 'bg-gray-100'}
    `}>
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Image 
            src={logo} 
            alt="Logo" 
            height={40} 
            className="mb-6"
          />
          <h2 className={`
            text-3xl fnt-semibold tracking-tight
            ${theme === 'light' ? 'text-white' : 'text-black'}
          `}>
            Welcome back
          </h2>
          <p className={`
            mt-2 text-sm
            ${theme === 'light' ? 'text-gray-450' : 'text-gray-600'}
          `}>
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
              className={`
                w-full
                ${theme === 'light' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-black' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'}
              `}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Continue'}
            </Button>
          </div>

          <div className="flex items-center flex-col justify-center my-4">
            <hr className={`w-full border-t ${theme === 'light' ? 'border-gray-700' : 'border-gray-300'}`} />
            <span className={`
              px-3 
              ${theme === 'light' ? 'text-gray-450 bg-gray-850' : 'text-gray-600 bg-gray-100'}
            `}>
              Or continue with
            </span>
          
            <hr className={`w-full border-t ${theme === 'light' ? 'border-gray-700' : 'border-gray-300'}`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline"
              type="button"
              onClick={() => signIn('google')}
              disabled={isLoading}
              className={`
                w-full 
                ${theme === 'light' 
                  ? 'border-gray-700 hover:bg-gray-700 text-black' 
                  : 'border-gray-300 hover:bg-gray-200 text-white'}
              `}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Google
            </Button>

            <Button 
              variant="outline"
              type="button"
              onClick={() => signIn('github')}
              disabled={isLoading}
              className={`
                w-full 
                ${theme === 'light' 
                  ? 'border-gray-700 hover:bg-gray-700 text-black' 
                  : 'border-gray-300 hover:bg-gray-200 text-white'}
              `}
            >
              <AiFillGithub className="mr-2 h-5 w-5" />
              GitHub
            </Button>
          </div>

          <div className="text-center">
            <p className={`
              text-sm 
              ${theme === 'light' ? 'text-gray-450' : 'text-gray-600'}
            `}>
              Don&apos;t have an account?{" "}
              <Link 
                href="/sign-up" 
                className={`
                  font-semibold 
                  ${theme === 'light' 
                    ? 'text-blue-600 hover:text-blue-500' 
                    : 'text-blue-500 hover:text-blue-600'}
                `}
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
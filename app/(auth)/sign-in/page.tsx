"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AiFillGithub } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import logo from "@/public/logo.svg"

import { Heading } from "@/components/heading"
import { Input } from "@/components/inputs/input"
import { Button } from "@/components/Button"
import Link from "next/link"
import Image from "next/image"

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
        router.push("/dashboard") // Redirect to dashboard or home page
        router.refresh()
      }
      if (callback?.error) {
        toast.error(callback.error)
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
            <Image src={logo} alt="logo" width={100} height={100} />
          <Heading 
            title="Welcome back to Cloudbnb" 
            subtitle="Login today, start big things!" 
          />
        </div>
        <form 
          onSubmit={handleSubmit(handleOnSubmit)} 
          className="mt-8 space-y-6"
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              id="email"
              label="Email"
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
              label="Continue" 
            //   type="submit" 
              disabled={isLoading} 
              onClick={()=>{}}
            //   fullWidth
            />
          </div>

          <div className="flex items-center justify-center my-4">
            <hr className="w-full border-t border-gray-300" />
            <span className="px-3 text-gray-500 bg-white">Or</span>
            <hr className="w-full border-t border-gray-300" />
          </div>

          <div className="space-y-3">
            <Button 
              outline 
              label="Continue with Google" 
              icon={FcGoogle} 
              onClick={() => signIn('google')}
              disabled={isLoading}
            />
            <Button 
              outline 
              label="Continue with Github" 
              icon={AiFillGithub} 
              onClick={() => signIn('github')}
              disabled={isLoading}
              
            />
          </div>

          <div className="text-center mt-4">
            <p className="text-neutral-600">
              Don&apos;t have an account?{" "}
              <Link 
                href="/sign-up" 
                className="text-neutral-800 hover:underline font-semibold"
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
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import axios from "axios"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { AiFillGithub } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { z } from "zod"
// @ts-ignore
import { zodResolver } from "@hookform/resolvers/zod"

// Validation schema
const signupSchema = z.object({
  name: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must include uppercase, lowercase, number, and special character"
    })
})

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const handleOnSubmit: SubmitHandler<z.infer<typeof signupSchema>> = async (data) => {
    setIsLoading(true)
    
    try {
      // Register user
      await axios.post("/api/register", data)
      
      // Attempt to sign in after registration
      const signInResponse = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password
      })

      if (signInResponse?.error) {
        toast.error("Registration successful, but login failed")
        router.push('/login')
      } else {
        toast.success("Registration successful")
        router.push('/dashboard')
      }
    } catch (error: any) {
      // Handle registration errors
      const errorMessage = error.response?.data?.error || "Registration failed"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Social login handlers
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  const handleGithubSignIn = () => {
    signIn("github", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start your journey with NEUROLOV
          </p>
        </div>
        
        <form 
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit(handleOnSubmit)}
          noValidate
        >
          <div className="rounded-md shadow-sm space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                required
                disabled={isLoading}
                className={`relative block w-full appearance-none rounded-md border 
                  ${errors.email ? 'border-red-500' : 'border-gray-300'}
                  px-3 py-2 text-gray-900 placeholder-gray-500 
                  focus:z-10 focus:border-indigo-500 focus:outline-none 
                  focus:ring-indigo-500 sm:text-sm
                  ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                {...register("name")}
                id="name"
                type="text"
                autoComplete="name"
                required
                disabled={isLoading}
                className={`relative block w-full appearance-none rounded-md border 
                  ${errors.name ? 'border-red-500' : 'border-gray-300'}
                  px-3 py-2 text-gray-900 placeholder-gray-500 
                  focus:z-10 focus:border-indigo-500 focus:outline-none 
                  focus:ring-indigo-500 sm:text-sm
                  ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                placeholder="Full Name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                {...register("password")}
                id="password"
                type="password"
                autoComplete="new-password"
                required
                disabled={isLoading}
                className={`relative block w-full appearance-none rounded-md border 
                  ${errors.password ? 'border-red-500' : 'border-gray-300'}
                  px-3 py-2 text-gray-900 placeholder-gray-500 
                  focus:z-10 focus:border-indigo-500 focus:outline-none 
                  focus:ring-indigo-500 sm:text-sm
                  ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative flex w-full justify-center rounded-md border border-transparent 
                bg-indigo-600 py-2 px-4 text-sm font-medium text-white 
                hover:bg-indigo-700 focus:outline-none focus:ring-2 
                focus:ring-indigo-500 focus:ring-offset-2
                ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>

          {/* Social Login Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="inline-flex w-full justify-center rounded-md border border-gray-300 
                bg-white py-2 px-4 text-sm font-medium text-gray-500 
                shadow-sm hover:bg-gray-50 focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <FcGoogle className="h-5 w-5" />
              <span className="sr-only">Sign up with Google</span>
            </button>

            <button
              type="button"
              onClick={handleGithubSignIn}
              disabled={isLoading}
              className="inline-flex w-full justify-center rounded-md border border-gray-300 
                bg-white py-2 px-4 text-sm font-medium text-gray-500 
                shadow-sm hover:bg-gray-50 focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <AiFillGithub className="h-5 w-5" />
              <span className="sr-only">Sign up with GitHub</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Log in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
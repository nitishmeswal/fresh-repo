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
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import logo from "@/public/logo.svg"

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
        router.push('/sign-in')
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start your journey with NEUROLOV
          </p>
        </div>
        
        <form 
          className="space-y-6" 
          onSubmit={handleSubmit(handleOnSubmit)}
          noValidate
        >
          <div className="space-y-4">
            <Input
              {...register("email")}
              id="email"
              type="email"
              disabled={isLoading}
              required
            />

            <Input
              {...register("name")}
              id="name"
              type="text"
              disabled={isLoading}
              required
            />

            <Input
              {...register("password")}
              id="password"
              type="password"
              disabled={isLoading}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <div className="flex items-center justify-center my-4">
            <hr className="w-full border-t border-muted" />
            <span className="px-3 text-muted-foreground bg-background">Or continue with</span>
            <hr className="w-full border-t border-muted" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Google
            </Button>

            <Button 
              variant="outline"
              type="button"
              onClick={handleGithubSignIn}
              disabled={isLoading}
              className="w-full"
            >
              <AiFillGithub className="mr-2 h-5 w-5" />
              GitHub
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link 
                href="/sign-in" 
                className="font-semibold text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
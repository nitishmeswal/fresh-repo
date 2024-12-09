"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { useTheme } from "next-themes";

// Validation schema
const signupSchema = z.object({
  firstName: z.string().min(3, { message: "First name must be at least 3 characters" }),
  lastName: z.string().min(3, { message: "Last name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must include uppercase, lowercase, number, and special character",
    }),
});

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  // Watch password input for live validation
  const password = watch("password");

  const validatePassword = (password: string) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/.test(password),
    });
  };

  const handleOnSubmit: SubmitHandler<z.infer<typeof signupSchema>> = async (data) => {
    setIsLoading(true);

    try {
      await axios.post("/api/register", data);

      const signInResponse = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInResponse?.error) {
        toast.error("Registration successful, but login failed");
        router.push("/sign-in");
      } else {
        toast.success("Registration successful");
        router.push("/");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleGithubSignIn = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
        theme === "light" ? "bg-gray-850" : "bg-gray-100"
      }`}
    >
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Image src={logo} alt="Logo" height={40} className="mb-6" />
          <h2
            className={`text-3xl font-semibold tracking-tight ${
              theme === "light" ? "text-white" : "text-black"
            }`}
          >
            Create your account
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(handleOnSubmit)} noValidate>
          <div className="space-y-4">
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Enter valid email"
              disabled={isLoading}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

            <div className="flex space-x-4">
              <Input
                {...register("firstName")}
                id="firstName"
                type="text"
                placeholder="First Name"
                disabled={isLoading}
              />
              <Input
                {...register("lastName")}
                id="lastName"
                type="text"
                placeholder="Last Name"
                disabled={isLoading}
              />
            </div>
            {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
            {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}

            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="Enter password"
              onChange={(e) => validatePassword(e.target.value)}
              disabled={isLoading}
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

            {/* Password Strength Indicator */}
            <div className="mt-2 space-y-1 text-sm">
              <p className={passwordStrength.length ? "text-green-500" : "text-red-500"}>At least 8 characters</p>
              <p className={passwordStrength.uppercase ? "text-green-500" : "text-red-500"}>
                At least 1 uppercase letter
              </p>
              <p className={passwordStrength.lowercase ? "text-green-500" : "text-red-500"}>
                At least 1 lowercase letter
              </p>
              <p className={passwordStrength.number ? "text-green-500" : "text-red-500"}>At least 1 number</p>
              <p className={passwordStrength.specialChar ? "text-green-500" : "text-red-500"}>
                At least 1 special character
              </p>
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Continue"}
          </Button>
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
              onClick={handleGoogleSignIn}
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
              onClick={handleGithubSignIn}
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
              Already have an account?{" "}
              <Link 
                href="/sign-in" 
                className={`
                  font-semibold 
                  ${theme === 'light' 
                    ? 'text-blue-600 hover:text-blue-500' 
                    : 'text-blue-500 hover:text-blue-600'}
                `}
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
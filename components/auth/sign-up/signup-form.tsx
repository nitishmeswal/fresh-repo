"use client"

import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { 
  signupSchema, 
  SignupFormData 
} from '@/constants/validation';
import { 
  validatePasswordStrength 
} from '@/utils/password-validation';
import { 
  PasswordStrengthIndicator 
} from './password-format-indecator';

export const SignupForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Watch password input for live validation
  // const password = watch("password");

  const handleOnSubmit: SubmitHandler<SignupFormData> = async (data) => {
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

  return (
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
          placeholder="Enter valid email"
          disabled={isLoading}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">
            {errors.email.message}
          </span>
        )}

          <Input
            {...register("name")}
            id="lastName"
            type="text"
            placeholder="name"
            disabled={isLoading}
          />
        {errors.name && (
          <span className="text-red-500 text-sm">
            {errors.name.message}
          </span>
        )}


        <Input
          {...register("password")}
          id="password"
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPasswordStrength(
            validatePasswordStrength(e.target.value)
          )}
          disabled={isLoading}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}

        <PasswordStrengthIndicator strength={passwordStrength} />
      </div>

      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full"
      >
        {isLoading ? "Creating Account..." : "Continue"}
      </Button>

      
      
    </form>
  );
};
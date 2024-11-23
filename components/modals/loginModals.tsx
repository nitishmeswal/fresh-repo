"use client"

import { useState } from "react"
import { signIn, SignInOptions } from "next-auth/react"
import { useRouter } from "next/navigation"

import { AiFillGithub } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

import useLoginModal from "@/hooks/useLoginModal"

import { Modal } from "@/components/modals/Modals"
import { Heading } from "@/components/heading"
import { Input } from "@/components/inputs/input"
import { Button } from "@/components/Button"

export const LoginModal = () => {
   const router = useRouter()
   const loginModalHooks = useLoginModal()
   const [isLoading, setIsLoading] = useState<boolean>(false)

   // Form state
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

   // Handle form submission
   const handleOnSubmit: SubmitHandler<FieldValues> = (data: SignInOptions | undefined) => {
      setIsLoading(true)

      signIn("credentials", {
         ...data,
         redirect: false, // don't redirect to any route
      }).then((callback) => {
         setIsLoading(false)

         if (callback?.ok) {
            toast.success("Logged in successfully")
            router.refresh() // refresh the page
            loginModalHooks.onClose()
         }

         if (callback?.error) {
            toast.error(callback.error)
         }
      })
   }

   const bodyContent = (
      <div className="flex flex-col gap-4">
         <Heading title="Welcome back to Cloudbnb" subtitle="Login today, start big things!" />
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
   )

   const footerContent = (
      <div className="flex flex-col gap-4 mt-3">
         <hr />
         <Button outline label="Continue with Google" icon={FcGoogle} onClick={() => {}} />
         <Button outline label="Continue with Github" icon={AiFillGithub} onClick={() => {}} />
         <div className="mt-4 font-light text-center text-neutral-500">
            <div className="flex flex-row items-center justify-center gap-2">
               <div>Don&apos;t have account?</div>
               <div
                  className="cursor-pointer text-neutral-800 hover:underline"
                  onClick={loginModalHooks.onClose}
               >
                  Sign Up
               </div>
            </div>
         </div>
      </div>
   )

   return (
      <Modal
         disabled={isLoading}
         isOpen={loginModalHooks.isOpen}
         title="Login Cloudbnb"
         body={bodyContent}
         footer={footerContent}
         actionLabel="Continue"
         onClose={loginModalHooks.onClose}
         onSubmit={handleSubmit(handleOnSubmit)}
      />
   )
}
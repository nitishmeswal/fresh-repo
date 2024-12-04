"use client"

import { useState } from "react"
import axios from "axios"
import { AiFillGithub } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import logo from "@/public/logo.svg"
import useRegisterModal from "@/hooks/useRegisterModal"

import { Modal } from "@/components/modals/Modals"
import { Heading } from "@/components/heading"
import { Input } from "@/components/inputs/input"
import { Button } from "@/components/Button"
import useLoginModal from "@/hooks/useLoginModal"

export const RegisterModal = () => {
   const registerModalHooks = useRegisterModal()
   const loginModalHooks = useLoginModal()
   const [isLoading, setIsLoading] = useState<boolean>(false)

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FieldValues>({
      defaultValues: {
         name: "",
         email: "",
         password: "",
      },
   })

   const handleOnSubmit: SubmitHandler<FieldValues> = (data: FieldValues | undefined) => {
      setIsLoading(true)

      axios
         .post("/api/register", data)
         .then(() => {
            registerModalHooks.onClose()
         })
         .catch(() => {
            toast.error("Error happened in register, please try again later.")
         })
         .finally(() => {
            setIsLoading(false)
         })
   }

   const bodyContent = (
      <div className="flex flex-col gap-4">
         <Heading title="Welcome to NEUROLOV" subtitle="Create account for start journey!" />
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
            id="name"
            label="Full Name"
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
               <div>Already have account?</div>
               <div
                  className="cursor-pointer text-neutral-800 hover:underline"
                  onClick={()=>
                     {
                        registerModalHooks.onClose()
                        return loginModalHooks.onOpen;
                     }}
               >
                  Log in
               </div>
            </div>
         </div>
      </div>
   )

   return (
      <Modal
         disabled={isLoading}
         isOpen={registerModalHooks.isOpen}
         title="Register NEUROLOV"
         body={bodyContent}
         footer={footerContent}
         actionLabel="Continue"
         onClose={registerModalHooks.onClose}
         onSubmit={handleSubmit(handleOnSubmit)}
      />
   )
}
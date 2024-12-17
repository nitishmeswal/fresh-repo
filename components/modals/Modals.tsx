"use client"

import { FC, useCallback, useEffect, useState } from "react"
import { IoMdClose } from "react-icons/io"

import { cn } from "@/lib/utils"

import { Button } from "@/components/Button"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Modal: FC<any> = ({
   isOpen,
   onClose,
   onSubmit,
   title,
   body,
   footer,
   actionLabel,
   disabled,
   secondaryAction,
   secondaryActionLabel,
}) => {
   const [showModal, setShowModal] = useState<boolean>(isOpen!)

   useEffect(() => {
      setShowModal(isOpen!)
   }, [isOpen])

   //* Handle Modal Close
   const onHandleModalClose = useCallback(() => {
      if (disabled) return

      setShowModal(false)
      setTimeout(() => {
         onClose()
      }, 300)
   }, [disabled, onClose])

   //* Handle Modal Submit
   const onHandleSubmit = useCallback(() => {
      if (disabled) return

      onSubmit()
   }, [disabled, onSubmit])

   //* Handle Secondary Action
   const onHandleSecondaryAction = useCallback(() => {
      if (disabled || !secondaryAction) return

      secondaryAction()
   }, [disabled, secondaryAction])

   if (!isOpen) return null

   return (
      <>
         <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-neutral-800/70">
            <div className="relative w-full h-full mx-auto my-6 md:w-4/6 lg:w-3/6 xl:w-2/5 lg:h-auto md:h-auto">
               {/* Content */}
               <div
                  className={cn(
                     "translate duration-300 h-full",
                     showModal ? "translate-y-0" : "translate-y-full",
                     showModal ? "opacity-100" : "opacity-0"
                  )}
               >
                  {/* Wrapping */}
                  <div className="relative flex flex-col w-full h-full bg-white border-0 rounded-lg shadow-lg outline-none translate lg:h-auto md:h-auto focus:outline-none">
                     {/* Header */}
                     <div className="relative flex items-center justify-center p-6 border-b rounded-t">
                        <button
                           onClick={onHandleModalClose}
                           className="absolute p-1 transition border-0 hover:opacity-70 left-9"
                        >
                           <IoMdClose size={18} />
                        </button>
                        <p className="text-lg font-semibold">{title}</p>
                     </div>

                     <div className="relative flex-auto p-6">{body}</div>

                     <div className="flex flex-col gap-2 p-6">
                        <div className="flex flex-row items-center w-full gap-4">
                           {secondaryAction && secondaryActionLabel && (
                              <Button
                                 outline
                                 disabled={disabled}
                                 label={secondaryActionLabel}
                                 onClick={onHandleSecondaryAction}
                              />
                           )}
                           <Button
                              disabled={disabled}
                              label={actionLabel}
                              onClick={onHandleSubmit}
                           />
                        </div>
                        {footer}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}
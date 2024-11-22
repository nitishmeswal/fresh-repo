"use client"

import { FC } from "react"

type HeadingTypes = {
   title: string
   subtitle?: string
   center?: boolean
}

export const Heading: FC<HeadingTypes> = ({ title, center, subtitle }) => {
   return (
      <div className={`${center ? "text-center" : "text-start"}`}>
         <p className="text-2xl font-bold">{title}</p>
         <p className="mt-2 font-light text-neutral-500">{subtitle}</p>
      </div>
   )
}
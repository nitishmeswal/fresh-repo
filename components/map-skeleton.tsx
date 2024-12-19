"use client"
import React from 'react'
import star from '@/public/star.svg'
import Image from 'next/image'
const MapSkel = ({label, value} : {
  label: string,
  value: string | number
}) => {
  return (
    <div className="flex flex-1 flex-shrink-0 flex-col justify-start items-start">
  <div className="flex items-center text-lg font-medium rounded-full py-2 px-3 border border-gray-400 dark:text-gray-100 text-black">
    <Image src={star} alt="star" className="w-6 h-6 mr-2" />
    <span>{label}</span>
  </div>

  <div className="text-4xl font-medium text-gray-900 dark:text-gray-100 mt-2 ml-2">
    {value}
  </div>
</div>
  )
}

export default MapSkel

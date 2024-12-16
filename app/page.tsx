"use client";
import React from 'react';
import { FilterMenu } from "@/components/FilterMenu"
import { filters, mainServices } from "@/utils/constant"
import { useTheme } from "next-themes";
import WorldMap from '@/components/icons/world-map';

export default function Home() {
  const { theme } = useTheme();


  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <div className={`flex flex-1 w-full p-8 flex-col`}>
      <div className="flex flex-row p-4 justify-start">
        {filters.map((filter, index) => (
          <FilterMenu 
            key={index} 
            name={filter.name} 
            filters={filter.options} 
          />
        ))}
      </div>
      <div className="flex justify-end flex-col py-4 transition-all duration-300">
        <ul className="flex flex-row justify-between">
          {mainServices.map((service, index) => (
            <li 
              key={index} 
              className={`
                flex shadow-md group 
                hover:bg-blue-600 
                flex-col p-4 w-76 
                mx-4 space-y-2 
                rounded-2xl 
                ${theme === 'light' 
                  ? 'bg-gray-850 hover:bg-blue-600' 
                  : 'bg-gray-100 hover:bg-blue-500'
                }`}
            >
              <div className="p-2 space-y-2">
                <h1 className={`
                  fill-foreground
                  text-[24px] 
                  font-semibold 
                  ${theme === 'light' 
                    ? 'text-white border-gray-700' 
                    : 'text-black border-gray-300'}
                `}>
                  {service.name}
                </h1>
                <p className={`
                  text-[11px] 
                  ${theme === 'light' 
                    ? 'text-gray-450 group-hover:text-[#D8D8D8]' 
                    : 'text-gray-600 group-hover:text-gray-800'}
                `}>
                  {service.description}
                </p>
              </div>
              <button className={`
                border w-fit rounded-full 
                flex justify-start px-4 
                ${theme === 'light' 
                  ? 'text-white border-gray-700' 
                  : 'text-black border-gray-300'}
              `}>
                start
              </button>
            </li>
          ))}
        </ul>
      </div>
      </div>
      <div className={ `flex flex-1 justify-center relative 
                      ${theme === 'light' ? 'bg-white' : ' bg-black' }`}>
        <WorldMap />

      </div>
    </div>

  )
}
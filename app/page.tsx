"use client";
import React from 'react';
import { FilterMenu } from "@/components/FilterMenu"
import { filters, mainServices } from "@/constants/values"
import { useTheme } from "next-themes";
import mapLight from '@/public/pages/map-light.svg';
import mapDark from '@/public/pages/map-dark.png';
import mapNight from '@/public/pages/map-night.png';
import Image from 'next/image';
import MapData from '@/components/map-data';

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className='flex flex-1 flex-col overflow-hidden'>
      <div className="flex flex-1 w-full px-8 pt-8 flex-col">
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
                  ${theme === "dark" 
                    ? 'bg-gray-850 hover:bg-blue-600' 
                    : 'bg-gray-100 hover:bg-blue-500'
                  }`}
              >
                <div className="p-2 space-y-2">
                  <h1 className={`
                    fill-foreground
                    text-[24px] 
                    font-semibold 
                    ${theme === "dark" 
                      ? 'text-white border-gray-700' 
                      : 'text-black border-gray-300'}
                  `}>
                    {service.name}
                  </h1>
                  <p className={`
                    text-[11px] 
                    ${theme === "dark" 
                      ? 'text-gray-450 group-hover:text-[#D8D8D8]' 
                      : 'text-gray-600 group-hover:text-gray-800'}
                  `}>
                    {service.description}
                  </p>
                </div>
                <button className={`
                  border w-fit rounded-full 
                  flex justify-start px-4 
                  ${theme === "dark" 
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

      {/* MAP SECTION */}
      <div className="relative flex justify-center w-full px-12 pb-8 overflow-hidden">
         <div className="relative w-full h-[600px]">
          <Image 
            src={mapNight} 
            alt="map" 
            layout="fill"
            objectFit="contain"
            className="w-full h-[360px]"
          />

          {/* MapData Overlay */}
          {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full max-w-4xl pointer-events-auto">
              <MapData />
            </div>
          </div> */}
        </div> 
      </div>
    </div>
  )
}

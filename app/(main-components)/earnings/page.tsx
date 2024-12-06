"use client"

import { DonutChart } from '@/components/charts/donut-chart';

import { useTheme } from 'next-themes';
import React from 'react'

const Home = () => {
  const { theme } = useTheme();
  return (
    <div className={`flex flex-1 w-full p-8 flex-col`}>
      <ul className="flex flex-row justify-between">

      <li className={`
                flex shadow-md group justify-stretch w-full 
                hover:bg-blue-600 
                flex-col p-4 w-76 
                mx-2 space-y-2 
                rounded-2xl 
                ${theme === 'light' 
                  ? 'bg-gray-850 text-gray-100 hover:bg-blue-600' 
                  : 'bg-gray-100 text-gray-850 hover:bg-blue-500'
                }`}
                >
                  <div className=' flex flex-col space-y-4 '>
                  <span className=' relative top-0 text-sm font-medium left-2'>
                    Job status report
                  </span>
                  <div className=' flex flex-1 justify-center p-2 items-center ' >
                    {/* please put the chart here */}
                    <DonutChart  />
                  </div>
                  </div>
            </li>
            <li className={`
                flex shadow-md group justify-stretch w-full 
                hover:bg-blue-600 
                flex-col p-4 w-76 
                mx-2 space-y-2 
                rounded-2xl 
                ${theme === 'light' 
                ? 'bg-gray-850 text-gray-100 hover:bg-blue-600' 
                  : 'bg-gray-100 text-gray-850 hover:bg-blue-600'
                }`}
                >
              Earnings report
            </li>
            <li className={`
                flex shadow-md group justify-stretch w-full 
                hover:bg-blue-600 
                flex-col p-4 w-76 
                mx-2 space-y-2 
                rounded-2xl 
                ${theme === 'light' 
                ? 'bg-gray-850 text-gray-100 hover:bg-blue-600' 
                  : 'bg-gray-100 text-gray-850 hover:bg-blue-600'
                }`}
                >
              Connect to earn
            </li>
          </ul>
      <div className="flex justify-end flex-col py-4 transition-all duration-300">
      </div>
    </div>
  )
}

export default Home

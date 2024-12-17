"use client"

import DoughnutChart from '@/components/charts/doughnut';
import { useTheme } from 'next-themes';
import React from 'react'
import { ChartData } from 'chart.js';
import { chartData, trafficData } from '@/utils/constant';
import EarningStatistics from '@/components/charts/horizantal-charts';
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
                    <DoughnutChart chartData={chartData}/>
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
              <div className=' flex flex-1 justify-center p-2 items-center'>
                <DoughnutChart 
                  chartData={trafficData} 
                  border={true}
                  />
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
              Connect to earn
            </li>
          </ul>
      <div className="flex justify-end flex-col py-4 transition-all duration-300">
        <EarningStatistics/>
      </div>
    </div>
  )
}

export default Home

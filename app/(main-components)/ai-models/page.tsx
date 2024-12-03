"use client"

import { FilterMenu } from '@/components/FilterMenu';
import { AIModelData } from '@/utils/constant';
import { useTheme } from 'next-themes';
import React from 'react'

const Home = () => {
  const { theme } = useTheme();
  return (
    <div className={`flex flex-1 w-full p-8 flex-col`}>
      <div className="flex flex-row p-4 justify-start">
        {AIModelData.map((filter, index) => (
          <FilterMenu
            key={index} 
            name={filter.name} 
            filters={filter.options}
          />
        ))}
      </div>
      <div className="flex justify-end flex-col py-4 transition-all duration-300">
      </div>
    </div>
  )
}

export default Home

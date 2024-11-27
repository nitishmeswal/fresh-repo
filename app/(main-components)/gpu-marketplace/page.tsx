import React from 'react';
import Image from 'next/image';
import { FilterMenu } from '@/components/FilterMenu';
import { filters, GPUData } from '@/utils/constant';

const Home = () => {
  return (
    <div className="flex flex-1 w-full h-screen py-8 px-4 flex-col overflow-hidden dark:bg-white bg-black2">
      {/* Fixed filter menu at the top */}
      <div className="flex flex-row p-4 justify-start shrink-0">
        {filters.map((filter, index) => (
          <FilterMenu
            name={filter.name}
            key={index}
            filters={filter.options}
          />
        ))}
      </div>
      
      {/* Scrollable GPU list */}
      <div className="w-full px-8 overflow-y-auto flex-grow">
        {GPUData.map((gpu, index) => (
          <div key={index} className="mb-4">
            <div className="flex p-6 rounded-lg my-4 dark:bg-gray-100 bg-gray-950 justify-center w-full">
              <div className="flex flex-1 flex-col dark:bg-gray-200 bg-gray-850 rounded-lg items-center px-5 py-4 w-full shadow-md dark:shadow-none">
                {/* GPU Header */}
                <div className="flex flex-row justify-between w-full">
                  <div className="flex items-center px-4">
                    <Image
                      src={gpu.imgSrc}
                      alt={gpu.gpuModel}
                      width={268}
                      height={124}
                    />
                    <div className="flex flex-col justify-start px-6">
                      <h1 className="text-xl font-medium dark:text-gray-900 text-white">{gpu.gpuModel}</h1>
                      <p className="text-md dark:text-gray-600 text-gray-650 space-y-4">{gpu.host}</p>
                      <p className="text-sm text-gray-700 dark:text-white font-medium mt-2 group-hover:text-gray-800 dark:group-hover:text-[#D8D8D8]">
                        {gpu.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center px-6 py-4 mb-4">
                    <button className="flex justify-center items-center h-fit rounded-full text-[15px] font-normal py-1 px-4 
                      dark:text-white dark:bg-gray-950 dark:hover:bg-blue-600 
                      text-gray-950 bg-gray-100 hover:bg-blue-600 
                      transition duration-200">
                      Rent {gpu.rentPrice}
                    </button>
                  </div>
                </div>

                {/* GPU Details Grid */}
                <div className='flex flex-shrink flex-wrap justify-center py-4 w-full'>
                  <div className="grid grid-cols-6 gap-x-4 gap-y-6 px-8 pt-6 w-full">
                    {[
                      { label: "COMPUTE MODE", value: gpu.computeMode },
                      { label: "GPU MODEL", value: gpu.gpuModel },
                      { label: "GPU MEMORY", value: gpu.gpuMemory },
                      { label: "CPU MODEL", value: gpu.cpuModel },
                      { label: "TOTAL MEMORY", value: gpu.totalMemory },
                      { label: "SM CLOCK", value: gpu.smClock },
                      { label: "CORES", value: gpu.cores },
                      { label: "MAX CUDA VERSION", value: gpu.maxCudaVersion },
                      { label: "STORAGE SPEED", value: gpu.storageSpeed },
                      { label: "STORAGE SIZE", value: gpu.storageSize },
                      { label: "MOTHERBOARD", value: gpu.motherboard },
                      { label: "SM CLOCK", value: gpu.smClock },
                    ].map((item, itemIndex) => (
                      <div key={itemIndex} className="flex flex-col">
                        <h1 className="text-sm dark:text-gray-500 text-gray-450 uppercase">{item.label}</h1>
                        <p className="text-sm dark:text-gray-900 text-white mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
import React from 'react';
import rtx3090 from "@/public/RTX 3090 vector model_1.png";
import Image, { StaticImageData } from 'next/image';
import { FilterMenu } from '@/components/FilterMenu';
import { filters } from '@/utils/constant';


type GPUDataType = {
  gpuModel: string;
  host: string;
  location: string;
  imgSrc: string | StaticImageData;
  computeMode: number;
  cores: number;
  gpuMemory: string;
  maxCudaVersion: string;
  cpuModel: string;
  totalMemory: string;
  storageSpeed: string;
  storageSize: string;
  motherboard: string;
  smClock: string;
  rentPrice: string;
};

const GPUData: GPUDataType[] = [
  {
    gpuModel: "1x NVIDIA GeForce RTX 3090",
    host: "Cc23fb45-1276-497a-8349-259659fa6b80",
    location: "Kanayannur Kerala IN (Asia/Kolkata)",
    imgSrc: rtx3090,
    computeMode: 0,
    cores: 10496,
    gpuMemory: "0 GB",
    maxCudaVersion: "535.183.01",
    cpuModel: "AMD Ryzen 9 7900X",
    totalMemory: "61.95 GB",
    storageSpeed: "2252.6 MB/s",
    storageSize: "344 GB",
    motherboard: "ASUSTek Computer INC.",
    smClock: "210 MHz",
    rentPrice: "1001 $VLOV/Hr",
  },
];

const Home = () => {
  return (
    <div className="flex flex-1 w-full p-4 my-4 flex-col bg-black justify-center items-center">
      <div className="flex flex-row p-4 justify-start">
        {filters.map((filter, _) => (
          <FilterMenu name={filter.name} key={_} filters={filter.options} />
        ))}
      </div>
      <ul className="w-full px-8">
        {GPUData.map((gpu, _) => (
          <li key={_}>
            <div className="flex p-6 rounded-lg my-4 bg-gray-950 justify-center w-full">
              <div className="flex flex-1 flex-col bg-gray-850 rounded-lg items-center px-5 py-4">
                {/* Adjusted this div */}
                <div className="flex flex-row justify-between w-full">
                  <div className="flex items-center px-4">
                    <Image
                      src={gpu.imgSrc}
                      key={_}
                      alt="RTX 3090"
                      width={268}
                      height={124}
                    />
                    <div className="flex flex-col justify-start px-6">
                      <h1 className="text-xl font-medium text-white">{gpu.gpuModel}</h1>
                      <p className="text-md text-gray-650 space-y-4">{gpu.host}</p>
                      <p className="text-sm text-white font-medium mt-2 group-hover:text-[#D8D8D8]">
                        {gpu.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center items-center px-6 py-4 mb-4">
                    <button className="flex justify-center items-center h-fit rounded-full text-[15px] font-normal py-1 px-4 text-gray-950 bg-gray-100 hover:bg-blue-600 hover:text-gray-50 transition duration-200">
                      Rent For {gpu.rentPrice}
                    </button>
                  </div>
                </div>
                <div className='flex flex-shrink flex-wrap justify-center py-4'>
                  <div className="grid grid-cols-6 gap-x-4 gap-y-6 px-8 pt-6">
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
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col">
                        <h1 className="text-sm text-gray-450 uppercase">{item.label}</h1>
                        <p className="text-sm text-white mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>


              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

"use client";
import React, { useEffect } from 'react';
import { filters, mainServices } from "@/constants/values"
import { useTheme } from "next-themes";
import Image from 'next/image';
import MapData from '@/components/map-data';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '@/styles/buttons.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cpu, Zap, Activity, Users, Bot, Store } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = React.useState(true);
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  },[])

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const getButtonText = (serviceName: string) => {
    switch(serviceName) {
      case 'GPU Marketplace':
        return 'Rent/Buy';
      case 'AI Models':
        return 'Deploy AI Model';
      case 'Connect to Earn':
        return 'Monetize your GPU';
      default:
        return 'Explore';
    }
  };

  const getButtonClass = (serviceName: string) => {
    switch(serviceName) {
      case 'GPU Marketplace':
        return 'gpu-marketplace';
      case 'AI Models':
        return 'ai-models';
      case 'Connect to Earn':
        return 'connect-earn';
      default:
        return '';
    }
  };

  if(loading) return <Loader></Loader>

  return (
    <div className='flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-background to-muted min-h-[90vh]'>
      <div className="flex w-full px-8 pt-8 pb-4 flex-col max-w-7xl mx-auto">
        <div className="flex justify-center flex-col space-y-8 transition-all duration-300">
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mainServices.map((service, index) => (
              <li 
                key={index} 
                className={`
                  flex shadow-lg group 
                  hover:bg-blue-600 
                  flex-col p-6 
                  rounded-3xl 
                  cursor-pointer
                  transform transition-all duration-300
                  hover:scale-105
                  hover:shadow-xl
                  ${theme === "dark" 
                    ? 'bg-gray-850/50 hover:bg-blue-600/90 backdrop-blur-sm' 
                    : 'bg-gray-100/90 hover:bg-blue-500/90 backdrop-blur-sm'}
                `}
                onClick={() => handleNavigate(service.href)}
              >
                <div className="p-4 space-y-4">
                  <h1 className={`
                    fill-foreground
                    text-3xl
                    font-bold
                    tracking-tight
                    ${theme === "dark" 
                      ? 'text-white border-gray-700' 
                      : 'text-black border-gray-300'}
                  `}>
                    {service.name}
                    {service.name === 'AI Models' || service.name === 'Connect to Earn' || service.name === 'GPU Marketplace' ? (
                      <div className="relative">
                        <span className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                          Beta
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-xl rounded-full"></div>
                      </div>
                    ) : null}
                  </h1>
                  <p className={`
                    text-sm
                    leading-relaxed
                    ${theme === "dark" 
                      ? 'text-gray-400 group-hover:text-gray-200' 
                      : 'text-gray-600 group-hover:text-gray-100'}
                  `}>
                    {service.description}
                  </p>
                </div>
                <div className="px-4 pb-4">
                  <button 
                    className={`custom-button ${getButtonClass(service.name)}`}
                  >
                    <span 
                      className="group-hover:scale-105 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(service.href);
                      }}
                    >
                      {getButtonText(service.name)}
                    </span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* NodeNet Section */}
      <div className="w-full max-w-7xl mx-auto px-8 pb-6 mt-4">
        <div className="bg-gray-850/50 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-3xl font-bold mb-2 ${theme === "dark" ? 'text-white' : 'text-black'}`}>
                NodeNet
              </h2>
              <p className={`text-sm ${theme === "dark" ? 'text-gray-400' : 'text-gray-600'}`}>
                Explore the next generation of decentralized computing
              </p>
            </div>
            <button 
              onClick={() => router.push('/NodeNet')}
              className="custom-button"
            >
              <span className="group-hover:scale-105 transition-all duration-300">
                Launch NodeNet
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

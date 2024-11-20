import React from 'react'
// import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import dashboard from '../public/dashboard.svg'
import aiModel from '../public/ai-models.svg'
import earnings from '../public/earnings.svg'
import connectToEarn from '../public/connect-to-earn.svg'
import settings from '../public/settings.svg'
import community from '../public/community.svg'
import gpuMarketplace from '../public/gpu-marketplace.svg'
import info from '../public/info.svg'
import Image from 'next/image'
const CustomSidebar = () => {
  const FeatureOptions = [
    {
      label: 'Dashboard',
      icon: dashboard,
      href: '/',
    },
    {
      label: 'GPU Marketplace',
      icon: aiModel,
      href: '/gpu-marketplace'
    },
    {
      label: 'AI Models',
      icon: gpuMarketplace,
      href: '/ai-models',
    },
    {
      label: 'Earnings',
      icon: earnings,
      href: '/earnings',
    },
    {
      label: 'Connect to Earn',
      icon: connectToEarn,
      href: '/settings',
    }]

  const SettingsOptions = [
    {
      label: 'Community',
      icon: community,
      href: '/community',
    },
    {
      label: 'Settings',
      icon: settings,
      href: '/settings',
    },
    {
      label: 'More info',
      icon: info,
      href: '/info',
    }
  ]
  return (
<div className=" bg-gray-950 px-6 pt-10 ">
  <aside id="default-sidebar" className="flex flex-col w-fit z-40 h-screen bg-gray-950 text-gray-100 transition-transform -translate-x-full sm:translate-x-0 ml-1"  aria-label="Sidebar">
   <div className="h-full px-3 py-4 overflow-y-auto  dark:bg-gray-800">
      <ul className="space-y-2 font-medium">
      {FeatureOptions && FeatureOptions.map((option, index)=>(
        <li key={index}>
        <a href={option.href} className="flex items-center px-3 py-2 rounded-full dark:text-gray-950 hover:bg-blue-600 dark:hover:bg-gray-700 group">
           <Image src={option.icon} alt={option.label} className="w-6 h-6 ml-2 text-gray-400" />
           <span className="ms-3 text-lg text-gray-200 hover:text-gray-100 mr-6">{option.label}</span>
        </a>
      </li>
      ))}
      <div className=' flex flex-1 justify-center items-center w-full h-[2px] bg-gray-800 mx-4 my-6'></div>
      {SettingsOptions && SettingsOptions.map((option, index)=>(
        <li key={index}>
        <a href={option.href} className="flex items-center px-3 py-2 rounded-full dark:text-gray-950 hover:bg-blue-600 dark:hover:bg-gray-700 group">
           <Image src={option.icon} alt={option.label} className="w-6 h-6 ml-2 text-gray-400" />
           <span className="ms-3 text-lg text-gray-200 hover:text-gray-100 mr-6">{option.label}</span>
        </a>
      </li>
      ))}
      </ul>
   </div>
  </aside>    
</div>

  )
}

export default CustomSidebar






  {/* <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {FeatureOptions.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild>
                  <a href={item.href} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 rounded-md">
                    <Image src={item.icon} alt={item.label} className="w-6 h-6" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <div className="w-full h-[2px] bg-gray-800 my-4"></div>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {SettingsOptions.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild>
                  <a href={item.href} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 rounded-md">
                    <Image src={item.icon} alt={item.label} className="w-6 h-6" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar> */}
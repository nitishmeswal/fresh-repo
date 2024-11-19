import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import dashboard from '../public/dashboard.svg'
import aiModel from '../public/ai-models.svg'
import earnings from '../public/earnings.svg'
import connectToEarn from '../public/connect-to-earn.svg'
import settings from '../public/settings.svg'
import community from '../public/community.svg'
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
      label: 'AI Models',
      icon: aiModel,
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
    <div className="flex flex-col w-full h-full bg-gray-950">
  <Sidebar>
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
  </Sidebar>
</div>

  )
}

export default CustomSidebar

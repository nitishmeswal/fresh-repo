


import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSidebarContext } from "@/context/sidebar-slug";

const FeatureOptions = [
  {
    label: "Dashboard",
    icon: "/dashboard.svg",
    href: "/dashboard",
  },
  {
    label: "GPU Marketplace",
    icon: "/gpu-marketplace.svg",
    href: "/gpu-marketplace",
  },
  {
    label: "AI Models",
    icon: "/ai-models.svg",
    href: "/ai-models",
  },
  {
    label: "Earnings",
    icon: "/earnings.svg",
    href: "/earnings",
  },
  {
    label: "Connect to Earn",
    icon: "/connect-to-earn.svg",
    href: "/connect-to-earn",
  },
];

const SettingsOptions = [
  {
    label: "Community",
    icon: "/community.svg",
    href: "/community",
  },
  {
    label: "Settings",
    icon: "/settings.svg",
    href: "/settings",
  },
  {
    label: "More info",
    icon: "/info.svg",
    href: "/more-info",
  },
];

const CustomSidebar = () => {
  const [hydrated, setHydrated] = useState(false);
  const { currentTab, setCurrentTabHandler } = useSidebarContext();
  console.log("current State of tab is ", currentTab);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;
  const handleTabSwitch = (tab: string) => {
    setCurrentTabHandler(tab);
  };

  const renderMenuItems = (options: typeof FeatureOptions) => {
    return options.map((option, index) => (
      <li key={index}>
        <a
          onClick={() => handleTabSwitch(option.href.substring(1))}
          href={option.href}
          className={`${
            currentTab === option.href.substring(1) ? "bg-blue-600" : ""
          } ${currentTab === '' && option.href === '/dashboard' ?  "bg-blue-600" : ""
          }
          flex items-center px-3 py-2 rounded-full dark:text-gray-950 hover:bg-blue-600 group`}
        >
          <Image
            src={option.icon}
            alt={option.label}
            className="w-6 h-6 ml-2"
            width={24}
            height={24}
          />
          <span
            className={`${
              currentTab === option.href.substring(1) || currentTab === '' && option.href === '/dashboard'  ? "text-gray-100"  : "text-gray-200" 
            }  ms-3 text-lg group-hover:text-gray-100`}
          >
            {option.label}
          </span>
        </a>
      </li>
    ));
  };

  return (
    <div className="bg-gray-950 px-2 pt-10">
      <aside
        id="default-sidebar"
        className="flex flex-col w-fit h-screen bg-gray-950 text-gray-100 transition-transform sm:translate-x-0 ml-1"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {renderMenuItems(FeatureOptions)}

            <div className="py-6">
              <div className="flex w-full h-[0.5px] bg-gray-850/10"></div>
            </div>

            {renderMenuItems(SettingsOptions)}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default CustomSidebar;

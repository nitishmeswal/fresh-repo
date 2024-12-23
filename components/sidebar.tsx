"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { FeatureOptions, SettingsOptions } from "@/constants/values";
import { Loader } from "lucide-react";

const CustomSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const [currentTab, setCurrentTab] = useState("");
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
  }, []);

  if (!load) return <Loader></Loader>;

  const handleTabSwitch = (tab: string) => {
    setCurrentTab(tab); // Update state locally
    router.push(`/${tab}`); // Navigate to the selected tab
  };

  const renderMenuItems = (options: typeof FeatureOptions) => {
    return options.map((option, index) => (
      <li key={index}>
        <a
          onClick={() => handleTabSwitch(option.href.substring(1))}
          className={`${
            currentTab === option.href.substring(1) ||
            (currentTab === "" && option.href.substring(1) === "")
              ?  "bg-blue-600 text-white"
                : 
              theme === "dark"
              ? "bg-transparent text-gray-300 hover:bg-gray-800 hover:text-gray-100"
              : "bg-transparent text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          } flex items-center px-3 py-2 rounded-full hover:cursor-pointer`}
        >
          <Image
            src={option.icon}
            alt={option.label!}
            className={`w-5 h-5 ml-2 ${
              currentTab === option.href.substring(1) ||
              (currentTab === "" && option.href.substring(1) === "")
                ? "filter brightness-150"
                : "filter brightness-100"
            }`}
            width={20}
            height={20}
          />
          <span className="mx-3 mr-4 text-lg">{option.label}</span>
        </a>
      </li>
    ));
  };

  return (
    <div
      className={`px-6 pt-[26px] h-full font-inter ${
        theme === "dark"
          ? "bg-gray-950 text-gray-100"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      <aside
        id="default-sidebar"
        className={`flex flex-col w-fit h-screen transition-transform sm:translate-x-0 ml-1 ${
          theme === "dark" ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-800"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full py-4 px-4 overflow-y-auto">
          <ul className="space-y-5 font-medium">
            {renderMenuItems(FeatureOptions)}

            <div className="py-6">
              <div
                className={`flex w-full h-[1px] ${
                  theme === "dark" 
                  ? "bg-gray-300"
                  : "bg-gray-150/20"
                }`}
              ></div>
            </div>

            {renderMenuItems(SettingsOptions)}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default CustomSidebar;

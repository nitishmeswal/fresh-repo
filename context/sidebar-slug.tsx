"use client"

import { createContext, useContext, useState } from "react";

type sidebarTabField = {
    currentTab: string;
    setCurrentTabHandler: (tab: string) => void;
} 

export const SidebarContex = createContext<sidebarTabField>({
    currentTab: "Dashboard",
    setCurrentTabHandler: () => {},
});

export function useSidebarContext () {
    const context = useContext(SidebarContex)
    if (!context) {
      throw new Error('useSidebarContext must be used within a SidebarProvider')
    }
    return context
  }
  

export const SidebarTabProvider = ({children}: {children: React.ReactNode}) => {
    const [currentTab, setCurrentTab] = useState<string>("");

    // useEffect(() => {
    //     // const storedTab = localStorage.getItem("currentTab");
    //     if (storedTab) {
    //         setCurrentTab(storedTab);
    //     }   
    // }, [])

    const setCurrentTabHandler = (tab: string) => {
        // localStorage.setItem("currentTab", tab);
        setCurrentTab(tab);
    }

    return (
        <SidebarContex.Provider value={{currentTab, setCurrentTabHandler}}>
            {children}
        </SidebarContex.Provider>
    )
}



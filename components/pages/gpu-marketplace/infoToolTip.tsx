"use client"

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TooltipFeatures from "./toolTipFeatures";

export const InfoTooltip = () => (
  <TooltipProvider delayDuration={100}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button 
          className="p-2 rounded-full hover:bg-gray-800/20 transition-colors group"
          aria-label="Information about features"
        >
          <Info className="h-5 w-5 text-gray-400 group-hover:text-[#20A5EF] transition-colors" />
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="left"
        sideOffset={10}
        className="w-[350px] p-4 bg-gray-900/95 backdrop-blur-sm text-gray-100 
                   rounded-xl border border-gray-800 shadow-xl animate-in fade-in-0 zoom-in-95"
      >
        <TooltipFeatures />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
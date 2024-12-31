"use client"

import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

interface NlovPaymentOptionProps {
  useNlov: boolean;
  onToggle: (value: boolean) => void;
}

export const NlovPaymentOption = ({ useNlov, onToggle }: NlovPaymentOptionProps) => (
  <div className={`p-6 rounded-xl border transition-all duration-300 ${
    useNlov 
      ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/50' 
      : 'bg-gray-900 border-gray-700'
  }`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className="text-lg font-semibold text-white">Pay with $NLOV</span>
        <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white">
          Save 30%
        </span>
      </div>
      <Button
        variant={useNlov ? "default" : "outline"}
        onClick={() => onToggle(!useNlov)}
        className={useNlov 
          ? `bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0`
          : "border-gray-600 text-gray-300 hover:bg-gray-800"
        }
      >
        <Coins className="w-4 h-4 mr-2" />
        {useNlov ? "Selected" : "Select"}
      </Button>
    </div>
  </div>
);
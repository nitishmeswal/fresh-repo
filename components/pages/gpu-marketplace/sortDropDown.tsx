import React from 'react';
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';

interface SortDropdownProps {
  onSort: (value: string) => void;
}

export const SortDropdown = ({ onSort }: SortDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="
            w-[180px] bg-black/40 border-blue-500/20 text-gray-300
            hover:text-blue-400 hover:border-blue-500/40
            focus:ring-blue-500/20 focus:border-blue-500/40
            transition-all duration-300
            flex items-center justify-between
          "
        >
          <span>Sort by</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="bg-black/95 border-blue-500/20 backdrop-blur-xl min-w-[180px]">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <DropdownMenuItem 
            onClick={() => onSort('relevance')}
            className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 focus:bg-blue-500/10 cursor-pointer"
          >
            Relevance
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onSort('price_low')}
            className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 focus:bg-blue-500/10 cursor-pointer"
          >
            Price: Low to High
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onSort('price_high')}
            className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 focus:bg-blue-500/10 cursor-pointer"
          >
            Price: High to Low
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onSort('rating')}
            className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 focus:bg-blue-500/10 cursor-pointer"
          >
            Customer Rating
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
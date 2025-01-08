'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FilterMenuProps {
  name: string;
  filters: string[];
  onSelect?: (value: string) => void;
}

export function FilterMenu({ name, filters, onSelect }: FilterMenuProps) {
  const [selected, setSelected] = React.useState(filters[0]);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect?.(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-black/40 border-purple-500/20 hover:border-purple-500/40
            hover:bg-black/60 transition-all duration-200"
        >
          <span className="text-gray-300">{name}</span>
          <span className="text-purple-400">{selected.replace(name.split(' ')[1] + ' ', '')}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-black/90 border border-purple-500/20 backdrop-blur-xl
          shadow-xl shadow-purple-500/10"
      >
        {filters.map((filter) => (
          <DropdownMenuItem
            key={filter}
            className={`
              flex items-center gap-2 cursor-pointer transition-all duration-200
              ${selected === filter
                ? 'bg-purple-500/20 text-purple-300'
                : 'text-gray-400 hover:text-purple-300 hover:bg-purple-500/10'
              }
            `}
            onClick={() => handleSelect(filter)}
          >
            {filter === selected && (
              <motion.div
                layoutId="activeFilter"
                className="absolute left-0 w-1 h-full bg-purple-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
            <span className="pl-6">{filter.replace(name.split(' ')[1] + ' ', '')}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

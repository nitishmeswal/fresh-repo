import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Star, Shield } from "lucide-react";

const TopFilters = () => {
  const [sortOption, setSortOption] = useState("relevance");
  const [showFiveStar, setShowFiveStar] = useState(false);
  const [showAssured, setShowAssured] = useState(false);

  return (
    <div className="flex flex-row p-4 justify-between items-center">
      <div className="flex flex-row items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between">
              Sort by
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            {['Price: Low to High', 'Price: High to Low', 'Popularity', 'New Listed'].map((item) => (
              <DropdownMenuItem 
                key={item}
                onClick={() => setSortOption(item)}
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="outline"
          onClick={() => setShowFiveStar(!showFiveStar)}
        >
          <Star className="h-4 w-4" /> 5★ & above
        </Button>

        <Button 
          variant="outline"
          onClick={() => setShowAssured(!showAssured)}
        >
          <Shield className="h-4 w-4" /> Neurolov Assured
        </Button>
      </div>
    </div>
  );
};

export default TopFilters;

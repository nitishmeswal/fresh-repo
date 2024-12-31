import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortDropdownProps {
  onSort: (option: string) => void;
}

export const SortDropdown = ({ onSort }: SortDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button 
        variant="outline" 
        className="w-[200px] justify-between dark:text-gray-350 text-gray-950
                   font-medium text-lg dark:bg-gray-950 bg-gray-350 group border-0 rounded-full"
      >
        Sort by
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent className="w-[200px] dark:bg-gray-950 bg-gray-350">
      {[
        { id: "price-low-high", label: "Price: Low to High" },
        { id: "price-high-low", label: "Price: High to Low" },
        { id: "popularity", label: "Popularity" },
        { id: "new-listed", label: "New Listed" },
        { id: "relevance", label: "Relevance" }
      ].map(option => (
        <DropdownMenuItem 
          key={option.id}
          onClick={() => onSort(option.id)}
          className="text-gray-950 dark:text-gray-350 font-medium text-lg 
                     hover:bg-gray-900 dark:hover:bg-gray-300
                     hover:text-gray-250 dark:hover:text-gray-800"
        >
          {option.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
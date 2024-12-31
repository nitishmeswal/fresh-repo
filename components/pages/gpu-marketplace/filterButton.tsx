import { Button } from "@/components/ui/button";

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const FilterButton = ({ active, onClick, children }: FilterButtonProps) => (
  <Button 
    variant="outline" 
    className={`flex items-center gap-2 font-medium text-lg border-0 rounded-full mx-2
      ${active 
        ? 'bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200' 
        : 'bg-gray-350 dark:bg-gray-950 text-gray-950 dark:text-gray-350'} 
      group`}
    onClick={onClick}
  >
    {children}
  </Button>
);
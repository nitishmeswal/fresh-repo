import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export const FilterButton = ({ active, onClick, children, className = '' }: FilterButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-300
        ${active 
          ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/50 text-blue-400'
          : 'bg-black/40 border-blue-500/20 text-gray-300 hover:text-blue-400'}
        border backdrop-blur-sm
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {children}
      </div>
      {active && (
        <motion.div
          layoutId="activeFilter"
          className="absolute inset-0 bg-blue-500/10 rounded-lg"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );
};
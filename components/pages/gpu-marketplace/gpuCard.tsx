import React from 'react';
import Image from 'next/image';
import { GPU } from '@/constants/values';
import { motion } from 'framer-motion';

interface GPUCardProps {
  gpu: GPU;
  onSelect: (gpu: GPU) => void;
}

const GpuCard = ({ gpu, onSelect }: GPUCardProps) => {
  const isAvailable = gpu.available && gpu.specs.available > 0;

  return (          
    <motion.div
      key={gpu.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-xl group h-[400px]"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-black to-blue-900/20 group-hover:from-blue-900/30 group-hover:to-black transition-all duration-300" />
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 h-full flex flex-col">
        {/* Image Section */}
        <motion.div 
          className="flex-1 flex items-center justify-center p-8 relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Image
            src={gpu.image}
            alt={gpu.name}
            width={300}
            height={200}
            className="object-contain transform group-hover:scale-105 transition-transform duration-300"
          />
        </motion.div>

        {/* Info Section */}
        <div className="p-6 bg-gradient-to-b from-gray-900/95 to-black border-t border-blue-500/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {gpu.name}
            </h3>
            <p className="text-lg font-medium text-blue-400">${gpu.price.usd}/hr</p>
          </div>

          {/* Rent Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => isAvailable && onSelect(gpu)}
            className={`
              w-full py-3 rounded-lg font-medium text-sm
              transition-all duration-300 transform
              ${isAvailable 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/25' 
                : 'bg-gray-800 text-gray-400 cursor-not-allowed'}
            `}
          >
            {isAvailable ? 'Rent GPU' : 'Coming Soon'}
          </motion.button>
        </div>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 border border-blue-500/0 group-hover:border-blue-500/20 transition-all duration-300 rounded-xl" />
    </motion.div>
  );
};

export default React.memo(GpuCard);

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/marketplace.module.css';
import { GPU } from '@/constants/values';
import { AnimatePresence, motion } from 'framer-motion';
import { AddToCartButton } from '../../addToCart';

interface GPUCardProps {
  gpu: GPU;
  onSelect: (gpu: GPU) => void;
}

const GPUCard: React.FC<GPUCardProps> = ({ gpu, onSelect }) => {
  return (          
            <motion.div
              key={gpu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#1A1A1A] rounded-xl overflow-hidden aspect-square"
            >
              {/* <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[120px] font-bold text-[#222] opacity-50">
                  {gpu.backgroundText}
                </span>
              </div> */}
              <div className="relative z-10 h-full flex flex-col">
                <motion.div 
                  className="flex-1 flex items-center justify-center p-8"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src={gpu.image}
                    alt={gpu.name}
                    width={300}
                    height={200}
                    className="object-contain"
                  />
                </motion.div>
                <div className="p-4 bg-[#111] border-t border-gray-800">
                  <h3 className="text-lg font-medium text-white mb-4">{gpu.name}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium text-blue-400">${gpu.price.usd}/hr</span>
                  </div>
                  <AddToCartButton 
                    item={{
                      id: gpu.id,
                      name: gpu.name,
                      price: gpu.price.usd,
                      type: 'gpu'
                    }}
                  />
                </div>
              </div>
            </motion.div>
  );
};

export default React.memo(GPUCard);

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { GPUSelectionType } from '@/services/types';

interface GPUCardProps {
  gpu: GPUSelectionType;
  isSelected: boolean;
  onSelect: (gpu: GPUSelectionType) => void;
}

export function GPUCard({ gpu, isSelected, onSelect }: GPUCardProps) {
  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-blue-500/20 bg-black/40 hover:border-blue-500/40'
      }`}
      onClick={() => onSelect(gpu)}
    >
      <div className="absolute inset-0 opacity-[0.03] bg-gradient-to-br from-blue-500 to-blue-600" />
      
      <div className="relative p-6 space-y-4">
        {/* GPU Image */}
        <div className="relative w-full h-48 mb-4">
          <Image
            src={`/images/gpus/${gpu.model.toLowerCase().replace(/\s+/g, '-')}.webp`}
            alt={gpu.model}
            fill
            className="object-contain"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 text-center bg-black/60 backdrop-blur-sm py-2 text-blue-300">
            {gpu.model}
          </div>
        </div>

        {/* GPU Specs */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">VRAM</span>
            <span className="text-blue-300">{gpu.vram}GB</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">CUDA Cores</span>
            <span className="text-blue-300">{gpu.cores.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Performance</span>
            <span className="text-blue-300">{gpu.tflops} TFLOPS</span>
          </div>
        </div>

        {/* Price */}
        <div className="pt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">Price per hour</div>
            <div className="text-lg font-semibold text-blue-300">${gpu.pricePerHour}</div>
          </div>
        </div>

        {/* Select Button */}
        <Button
          className={`w-full ${
            isSelected
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-blue-500/10 hover:bg-blue-500/20'
          }`}
          variant={isSelected ? 'default' : 'outline'}
        >
          {isSelected ? 'Selected' : 'Select GPU'}
        </Button>
      </div>
    </Card>
  );
}

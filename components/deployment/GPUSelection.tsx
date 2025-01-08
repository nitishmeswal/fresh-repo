'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { GPUSelectionType } from '@/services/types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const gpuOptions: GPUSelectionType[] = [
  {
    model: 'NVIDIA RTX 4090',
    vram: 24,
    cores: 16384,
    tflops: 82.6,
    pricePerHour: 1.5
  },
  {
    model: 'NVIDIA RTX 3090',
    vram: 24,
    cores: 10496,
    tflops: 35.6,
    pricePerHour: 1.2
  },
  {
    model: 'NVIDIA A100',
    vram: 80,
    cores: 6912,
    tflops: 19.5,
    pricePerHour: 2.5
  }
];

interface GPUSelectionProps {
  options: GPUSelectionType[];
  selectedGpu: GPUSelectionType | null;
  onSelect: (gpu: GPUSelectionType) => void;
  onNext: () => void;
  onBack: () => void;
}

export function GPUSelection({ options = gpuOptions, selectedGpu, onSelect, onNext, onBack }: GPUSelectionProps) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          GPU Selection
        </h2>
        <p className="text-gray-400">Choose a GPU for your deployment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((gpu) => (
          <Card
            key={gpu.model}
            className={`p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedGpu?.model === gpu.model
                ? 'bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-500'
                : 'bg-gray-900/50 hover:bg-gray-800/50 border-gray-800'
            } backdrop-blur-xl border`}
            onClick={() => onSelect(gpu)}
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">{gpu.model}</h3>
                <p className="text-sm text-gray-400">
                  {gpu.tflops.toFixed(1)} TFLOPs
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">VRAM</span>
                  <span className="text-white">{gpu.vram}GB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">CUDA Cores</span>
                  <span className="text-white">{gpu.cores.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price/Hour</span>
                  <span className="text-white">${gpu.pricePerHour}</span>
                </div>
              </div>

              {selectedGpu?.model === gpu.model && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-black/40 border-blue-500/20 hover:border-blue-500/40 text-blue-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={!selectedGpu}
          className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white ${
            !selectedGpu && 'opacity-50 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

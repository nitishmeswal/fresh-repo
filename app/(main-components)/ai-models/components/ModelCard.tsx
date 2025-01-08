'use client';
import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { AIModel } from '@/services/types';
import { useCredits } from '@/context/CreditContext';

interface ModelCardProps {
  model: AIModel;
  onDeploy: (model: AIModel) => void;
}

export function ModelCard({ model, onDeploy }: ModelCardProps) {
  const { credits } = useCredits();
  const Icon = model.icon;
  const totalCost = model.pricing.base + model.pricing.perHour;
  const hasEnoughCredits = credits >= totalCost;

  return (
    <div 
      className={`bg-gradient-to-b from-gray-900 to-[#1A1A1A] p-6 rounded-xl border border-gray-800 hover:border-blue-500 transition-all ${hasEnoughCredits ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
      onClick={() => hasEnoughCredits && onDeploy(model)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          {React.createElement(Icon, { className: "w-6 h-6 text-blue-500" })}
        </div>
        <button className="text-gray-400 hover:text-pink-500 transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-white">{model.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{model.description}</p>
      
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 bg-blue-500/10 rounded-full text-xs text-blue-400">
            {model.type}
          </span>
          {model.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs ${
                tag === 'Premium'
                  ? 'bg-purple-500/20 text-purple-400'
                  : tag === 'Fast'
                  ? 'bg-green-500/20 text-green-400'
                  : tag === 'GPU'
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Cost</span>
            <div className="text-sm">
              {model.pricing.base > 0 && (
                <span className="text-gray-300">{model.pricing.base} credits + </span>
              )}
              <span className="text-blue-400 font-medium">{model.pricing.perHour} credits/hr</span>
            </div>
          </div>
          {!hasEnoughCredits && (
            <span className="text-xs text-red-400">Insufficient credits</span>
          )}
        </div>
      </div>
    </div>
  );
}

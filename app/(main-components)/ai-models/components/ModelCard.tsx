'use client';
import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';

interface ModelCardProps {
  model: {
    id: string;
    name: string;
    description: string;
    icon: any;
    price: number;
    type: string;
  };
  onSelect: (model: any) => void;
}

export function ModelCard({ model, onSelect }: ModelCardProps) {
  return (
    <div 
      className="bg-gradient-to-b from-gray-900 to-[#1A1A1A] p-6 rounded-xl border border-gray-800 hover:border-blue-500 transition-all cursor-pointer"
      onClick={() => onSelect(model)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          {React.createElement(model.icon, { className: "w-6 h-6 text-blue-500" })}
        </div>
        <button className="text-gray-400 hover:text-pink-500 transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-white">{model.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{model.description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-300">{model.type}</span>
        <span className="text-blue-400 font-semibold">${model.price}/mo</span>
      </div>
    </div>
  );
}

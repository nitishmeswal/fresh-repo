'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { AIModel } from '@/services/types';
import { Button } from '@/components/ui/button';

interface ModelCardProps {
  model: AIModel;
  onDeploy: (model: AIModel) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, onDeploy }) => {
  const Icon = model.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-[#1A1A1A] rounded-xl overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-[#222] rounded-lg">
            <Icon className="w-6 h-6 text-gray-300" />
          </div>
          <Button variant="ghost" size="icon">
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">{model.name}</h3>
        <p className="text-sm text-gray-400 mb-4">{model.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {model.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm ${
                tag === 'Premium'
                  ? 'bg-purple-900/50 text-purple-300'
                  : 'bg-[#222] text-gray-300'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <Button
          onClick={() => onDeploy(model)}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700"
        >
          Deploy
        </Button>
      </div>
    </motion.div>
  );
};

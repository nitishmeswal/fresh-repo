'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterMenu } from '@/components/FilterMenu';
import { Heart, Image as ImageIcon, Zap, Box, Video, Brain, MessageSquare, Music, Clock } from 'lucide-react';
import { AddToCartButton } from '@/components/addToCart';
// import { AddToCartButton } from '@/app/(secondary-components)/cart/AddToCartButton';
AddToCartButton
const filterOptions = {
  generation: {
    name: "Generation",
    filters: ["Text", "Image", "Video", "3D", "Audio", "Real-time"]
  },
  type: {
    name: "Type",
    filters: ["Open Source", "Closed Source"]
  },
  sort: {
    name: "Sort by",
    filters: ["Newest", "Price: Low to High", "Price: High to Low"]
  }
};

const models = [
  {
    id: '1',
    name: 'Flux Image Gen',
    description: 'High-performance image generation and manipulation',
    icon: ImageIcon,
    price: 8,
    type: 'image',
    tags: ['Premium', 'Fast']
  },
  {
    id: '2',
    name: 'Fast API',
    description: 'High-speed API development and deployment',
    icon: Zap,
    price: 5,
    type: 'api',
    tags: ['Fast', 'Efficient']
  },
  {
    id: '3',
    name: 'AI Super Agents',
    description: 'Advanced autonomous AI agents for complex tasks',
    icon: Brain,
    price: 12,
    type: 'agent',
    tags: ['Premium', 'Advanced']
  },
  {
    id: '4',
    name: 'Deepfake',
    description: 'Advanced video synthesis and manipulation',
    icon: Video,
    price: 15,
    type: 'video',
    tags: ['Premium', 'High-Quality']
  },
  {
    id: '5',
    name: 'PyTorch',
    description: 'Deep learning and neural network training',
    icon: Brain,
    price: 10,
    type: 'ml',
    tags: ['Open Source', 'Flexible']
  },
  {
    id: '6',
    name: 'LLM Server',
    description: 'Large Language Model hosting and inference',
    icon: MessageSquare,
    price: 20,
    type: 'text',
    tags: ['Premium', 'Scalable']
  },
  {
    id: '7',
    name: '3D Server',
    description: '3D model generation and rendering',
    icon: Box,
    price: 18,
    type: '3d',
    tags: ['Premium', 'High-Performance']
  },
  {
    id: '8',
    name: 'Realtime',
    description: 'Real-time AI processing and inference',
    icon: Clock,
    price: 25,
    type: 'realtime',
    tags: ['Premium', 'Low-Latency']
  },
  {
    id: '9',
    name: 'Audio Server',
    description: 'Audio processing and generation',
    icon: Music,
    price: 15,
    type: 'audio',
    tags: ['Premium', 'High-Fidelity']
  }
];

export default function AiModelsPage() {
  return (
    <div className="flex flex-1 w-full min-h-screen flex-col bg-[#111111]">
      {/* Top Filter Bar */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-800">
        {Object.values(filterOptions).map((option, index) => (
          <FilterMenu key={index} name={option.name} filters={option.filters} />
        ))}
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <AnimatePresence>
          {models.map((model) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1A1A1A] rounded-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#222] rounded-lg">
                    <model.icon size={24} className="text-blue-400" />
                  </div>
                  <button className="p-2 hover:bg-[#222] rounded-lg transition-colors">
                    <Heart size={20} className="text-gray-400" />
                  </button>
                </div>

                <h3 className="text-xl font-medium text-white mb-2">{model.name}</h3>
                <p className="text-gray-400 mb-4">{model.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#222] rounded-full text-sm text-gray-300">
                    {model.type}
                  </span>
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

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-medium text-blue-400">${model.price}/hr</span>
                  <AddToCartButton 
                    item={{
                      id: model.id,
                      name: model.name,
                      price: model.price,
                      type: 'ai-model'
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

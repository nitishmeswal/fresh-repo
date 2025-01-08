'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Upload, ChevronDown } from 'lucide-react';
import { AIModel } from '@/services/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CustomModelCardProps {
  model: AIModel;
  onDeploy: (model: AIModel) => void;
}

export function CustomModelCard({ model, onDeploy }: CustomModelCardProps) {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [customConfig, setCustomConfig] = useState({
    containerImage: model.defaultConfig.containerImage,
    exposedPorts: model.defaultConfig.exposedPorts,
    minDisk: model.defaultConfig.minDisk,
    minVram: model.defaultConfig.minVram
  });

  const handleDeploy = () => {
    const customModel = {
      ...model,
      defaultConfig: {
        ...customConfig,
        containerImage: githubUrl ? `ghcr.io/${githubUrl}:latest` : customConfig.containerImage
      }
    };
    onDeploy(customModel);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const url = e.dataTransfer.getData('text');
    if (url.includes('github.com')) {
      setGithubUrl(url.replace('https://github.com/', ''));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="p-6 cursor-pointer transition-all duration-200 hover:scale-105 
          bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20
          backdrop-blur-xl relative overflow-hidden group"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-900/50 rounded-lg">
              <model.icon className="w-6 h-6 text-purple-300" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsConfiguring(!isConfiguring)}>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isConfiguring ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">{model.name}</h3>
          <p className="text-sm text-gray-400 mb-4">{model.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {model.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm bg-purple-900/50 text-purple-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {isConfiguring && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 mb-4"
            >
              <div className="relative">
                <Input
                  placeholder="GitHub Repository URL"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full bg-black/20 border-purple-500/20 focus:border-purple-500"
                />
                <GitBranch className="absolute right-3 top-2.5 w-4 h-4 text-purple-400" />
              </div>

              <div
                className="border-2 border-dashed border-purple-500/20 rounded-lg p-4 text-center
                  hover:border-purple-500/40 transition-colors duration-200"
              >
                <Upload className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">
                  Drag and drop your GitHub repository URL here
                </p>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Advanced Configuration
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Container Image</label>
                      <Input
                        value={customConfig.containerImage}
                        onChange={(e) => setCustomConfig({
                          ...customConfig,
                          containerImage: e.target.value
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Exposed Ports</label>
                      <Input
                        value={customConfig.exposedPorts.join(', ')}
                        onChange={(e) => setCustomConfig({
                          ...customConfig,
                          exposedPorts: e.target.value.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p))
                        })}
                        className="mt-1"
                        placeholder="8080, 3000"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Minimum Disk (GB)</label>
                      <Input
                        type="number"
                        value={customConfig.minDisk}
                        onChange={(e) => setCustomConfig({
                          ...customConfig,
                          minDisk: parseInt(e.target.value)
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Minimum VRAM (GB)</label>
                      <Input
                        type="number"
                        value={customConfig.minVram}
                        onChange={(e) => setCustomConfig({
                          ...customConfig,
                          minVram: parseInt(e.target.value)
                        })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </motion.div>
          )}

          <Button
            onClick={handleDeploy}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 
              hover:from-purple-600 hover:to-blue-600 text-white"
          >
            Deploy Custom Model
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

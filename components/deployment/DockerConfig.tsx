'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DockerConfig as DockerConfigType } from '@/services/types';

interface DockerConfigProps {
  config: DockerConfigType;
  onChange: (config: DockerConfigType) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DockerConfig({ config, onChange, onNext, onBack }: DockerConfigProps) {
  const handleChange = (field: keyof DockerConfigType, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Docker Configuration
        </h2>
        <p className="text-gray-400">Configure your container settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Template Name</label>
            <Input
              value={config.templateName}
              onChange={(e) => handleChange('templateName', e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-100"
              placeholder="Enter template name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Container Image</label>
            <Input
              value={config.containerImage}
              onChange={(e) => handleChange('containerImage', e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-100"
              placeholder="Enter container image"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Container Disk (GB)</label>
            <Input
              type="number"
              value={config.containerDisk}
              onChange={(e) => handleChange('containerDisk', parseInt(e.target.value))}
              className="bg-gray-800 border-gray-700 text-gray-100"
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Minimum VRAM (GB)</label>
            <Input
              type="number"
              value={config.minVram}
              onChange={(e) => handleChange('minVram', parseInt(e.target.value))}
              className="bg-gray-800 border-gray-700 text-gray-100"
              min={1}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-8 py-2 text-gray-300 border-gray-700 hover:bg-gray-800"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

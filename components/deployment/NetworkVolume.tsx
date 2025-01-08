'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';
import { NetworkVolume as NetworkVolumeType } from '@/services/types';

interface NetworkVolumeProps {
  onNext: (data: NetworkVolumeType) => void;
  onBack: () => void;
}

const volumeTypes = ['Local', 'Network', 'Cloud'];

export function NetworkVolume({ onNext, onBack }: NetworkVolumeProps) {
  const [volumeName, setVolumeName] = React.useState('');
  const [volumeType, setVolumeType] = React.useState('');
  const [diskSize, setDiskSize] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      volumeName,
      volumeType,
      diskSize: parseInt(diskSize) || 0,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Network Volume Configuration
        </h2>
        <p className="text-gray-400">Configure storage for your deployment</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="volumeName" className="block text-sm font-medium text-gray-300 mb-1">
                Volume Name
              </label>
              <Input
                id="volumeName"
                value={volumeName}
                onChange={(e) => setVolumeName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
                placeholder="Enter volume name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Volume Type
              </label>
              <Select
                value={volumeType}
                onValueChange={setVolumeType}
                placeholder="Select volume type"
                className="bg-gray-800 border-gray-700 text-gray-100"
              >
                {volumeTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="diskSize" className="block text-sm font-medium text-gray-300 mb-1">
                Disk Size (GB)
              </label>
              <Input
                id="diskSize"
                type="number"
                value={diskSize}
                onChange={(e) => setDiskSize(e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
                placeholder="Enter disk size in GB"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="px-8 py-2 text-gray-300 border-gray-700 hover:bg-gray-800"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}

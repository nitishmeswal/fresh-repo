import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Cpu, MemoryStick, Activity, HardDrive, Network } from 'lucide-react';

export const ModelMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="p-6 bg-black/40 border-blue-500/20">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-400">CPU Usage</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">42.6%</div>
          </div>
          <Cpu className="w-5 h-5 text-blue-400" />
        </div>
        <div className="mt-4 h-2 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '42.6%' }}
            transition={{ duration: 1 }}
            className="h-full bg-blue-500"
          />
        </div>
      </Card>

      <Card className="p-6 bg-black/40 border-blue-500/20">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-400">Memory</div>
            <div className="text-2xl font-bold text-green-400 mt-1">61.1%</div>
          </div>
          <MemoryStick className="w-5 h-5 text-green-400" />
        </div>
        <div className="mt-4 h-2 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '61.1%' }}
            transition={{ duration: 1 }}
            className="h-full bg-green-500"
          />
        </div>
      </Card>

      <Card className="p-6 bg-black/40 border-blue-500/20">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-400">GPU Usage</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">66.0%</div>
          </div>
          <Activity className="w-5 h-5 text-purple-400" />
        </div>
        <div className="mt-4 h-2 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '66%' }}
            transition={{ duration: 1 }}
            className="h-full bg-purple-500"
          />
        </div>
      </Card>

      <Card className="p-6 bg-black/40 border-blue-500/20">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-400">Disk I/O</div>
            <div className="text-2xl font-bold text-yellow-400 mt-1">32.3%</div>
          </div>
          <HardDrive className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="mt-4 h-2 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '32.3%' }}
            transition={{ duration: 1 }}
            className="h-full bg-yellow-500"
          />
        </div>
      </Card>

      <Card className="p-6 bg-black/40 border-blue-500/20">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-400">Network I/O</div>
            <div className="text-2xl font-bold text-pink-400 mt-1">12.3%</div>
          </div>
          <Network className="w-5 h-5 text-pink-400" />
        </div>
        <div className="mt-4 h-2 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '12.3%' }}
            transition={{ duration: 1 }}
            className="h-full bg-pink-500"
          />
        </div>
      </Card>
    </div>
  );
};

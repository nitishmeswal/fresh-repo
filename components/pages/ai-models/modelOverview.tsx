import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Box,
  Activity,
  Zap,
  Network,
  HardDrive
} from 'lucide-react';

export const ModelOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Deployment Info */}
      <Card className="p-6 bg-black/40 border-blue-500/20">
        <h3 className="text-lg font-semibold text-blue-400 mb-6">Deployment Information</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Box className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm text-gray-400">Container ID</span>
            </div>
            <span className="text-sm text-blue-400 font-mono">64900000f78ee474</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-sm text-gray-400">Deployed On</span>
            </div>
            <span className="text-sm text-blue-400">1/7/2025, 4:05:32 PM</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Activity className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm text-gray-400">Status</span>
            </div>
            <Badge variant="outline" className="border-green-500/20 text-green-400">
              running
            </Badge>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card className="p-6 bg-black/40 border-blue-500/20">
        <h3 className="text-lg font-semibold text-blue-400 mb-6">Performance Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Latency */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm text-gray-400">Latency</span>
              </div>
              <span className="text-sm text-blue-400">45ms</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '45%' }}
                transition={{ duration: 1 }}
                className="h-full bg-yellow-500"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0ms</span>
              <span>100ms</span>
            </div>
          </div>

          {/* Bandwidth */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Network className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-sm text-gray-400">Bandwidth</span>
              </div>
              <span className="text-sm text-blue-400">850 Mbps</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1 }}
                className="h-full bg-blue-500"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 Mbps</span>
              <span>1000 Mbps</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

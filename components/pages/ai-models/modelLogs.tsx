import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';

export const ModelLogs = () => {
  const logs = [
    {
      timestamp: '2025-01-07 15:05:32',
      level: 'info',
      message: 'Container started successfully'
    },
    {
      timestamp: '2025-01-07 15:05:33',
      level: 'info',
      message: 'Loading model weights from storage'
    },
    {
      timestamp: '2025-01-07 15:05:35',
      level: 'info',
      message: 'Model loaded successfully'
    },
    {
      timestamp: '2025-01-07 15:05:36',
      level: 'info',
      message: 'Starting inference server on port 8080'
    },
    {
      timestamp: '2025-01-07 15:05:36',
      level: 'info',
      message: 'Server ready to accept connections'
    },
    {
      timestamp: '2025-01-07 15:06:01',
      level: 'debug',
      message: 'Received inference request [id: 12345]'
    },
    {
      timestamp: '2025-01-07 15:06:02',
      level: 'debug',
      message: 'Processing batch of size 1'
    },
    {
      timestamp: '2025-01-07 15:06:03',
      level: 'info',
      message: 'Request completed successfully'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-blue-400">Container Logs</h2>
          <p className="text-sm text-gray-400">Container ID: 64900000f78ee474</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="border-blue-500/20 hover:bg-blue-500/10"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-blue-500/20 hover:bg-blue-500/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <Card className="p-4 bg-black/40 border-blue-500/20">
        <div className="font-mono text-sm space-y-2">
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-2 rounded
                ${log.level === 'info' 
                  ? 'text-blue-400 bg-blue-500/10' 
                  : log.level === 'debug'
                  ? 'text-gray-400 bg-gray-500/10'
                  : 'text-yellow-400 bg-yellow-500/10'}
              `}
            >
              <span className="text-gray-500">[{log.timestamp}]</span>{' '}
              <span className="uppercase text-xs font-semibold">{log.level}</span>{' '}
              {log.message}
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

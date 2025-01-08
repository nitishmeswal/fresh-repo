'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Cpu, Thermometer, Fan, Zap, MemoryStick } from 'lucide-react';

interface GPUStats {
  model: string;
  temperature: number;
  fanSpeed: number;
  utilization: number;
  powerDraw: number;
  memoryUsed: number;
  totalMemory: number;
  memoryClock: number;
  uptime: number;
}

interface GPUMonitorProps {
  stats: GPUStats;
  sessionDuration: number;
}

export const GPUMonitor: React.FC<GPUMonitorProps> = ({ stats, sessionDuration }) => {
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const metrics = [
    {
      icon: Thermometer,
      label: 'Temperature',
      value: `${stats.temperature}°C`,
      color: stats.temperature > 80 ? 'text-red-500' : 'text-green-500',
      progress: (stats.temperature / 100) * 100
    },
    {
      icon: Fan,
      label: 'Fan Speed',
      value: `${stats.fanSpeed}%`,
      color: 'text-blue-500',
      progress: stats.fanSpeed
    },
    {
      icon: Cpu,
      label: 'GPU Usage',
      value: `${stats.utilization}%`,
      color: 'text-purple-500',
      progress: stats.utilization
    },
    {
      icon: MemoryStick,
      label: 'VRAM Usage',
      value: `${stats.memoryUsed}/${stats.totalMemory}GB`,
      color: 'text-yellow-500',
      progress: (stats.memoryUsed / stats.totalMemory) * 100
    },
    {
      icon: Zap,
      label: 'Power Draw',
      value: `${stats.powerDraw}W`,
      color: 'text-orange-500',
      progress: (stats.powerDraw / 400) * 100 // Assuming 400W max
    }
  ];

  return (
    <Card className="p-6 bg-[#1A1A1A] border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{stats.model}</h2>
          <p className="text-sm text-gray-400">Session Time: {formatUptime(stats.uptime)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Memory Clock</p>
          <p className="text-lg font-bold text-white">{stats.memoryClock} MHz</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
              <span className="text-sm text-gray-400">{metric.label}</span>
            </div>
            <Progress value={metric.progress} className="h-2" />
            <p className={`text-lg font-bold ${metric.color}`}>{metric.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

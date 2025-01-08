'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Server, Clock, Cpu, MemoryStick, HardDrive, Network, RefreshCw, Power, AlertTriangle, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DeploymentStatusProps {
  containerId: string;
  containerName: string;
  status: string;
  deployedOn: string;
  logs?: string[];
  metrics?: {
    cpu: number;
    memory: number;
    gpu: number;
    disk: number;
    network: number;
    requests: number;
  };
  onRestart?: () => void;
  onDestroy?: () => void;
}

export function DeploymentStatus({
  containerId,
  containerName,
  status,
  deployedOn,
  logs = [],
  metrics = {
    cpu: 0,
    memory: 0,
    gpu: 0,
    disk: 0,
    network: 0,
    requests: 0
  },
  onRestart,
  onDestroy
}: DeploymentStatusProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'logs' | 'metrics'>('overview');
  const [isConfirmingDestroy, setIsConfirmingDestroy] = useState(false);
  const [mockMetrics, setMockMetrics] = useState(metrics);

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMockMetrics(prev => ({
        cpu: Math.min(100, prev.cpu + Math.random() * 10 - 5),
        memory: Math.min(100, prev.memory + Math.random() * 8 - 4),
        gpu: Math.min(100, prev.gpu + Math.random() * 15 - 7),
        disk: Math.min(100, prev.disk + Math.random() * 2 - 1),
        network: Math.min(100, prev.network + Math.random() * 20 - 10),
        requests: prev.requests + Math.floor(Math.random() * 3)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'text-gray-500';
    
    switch (status.toLowerCase()) {
      case 'running':
        return 'text-green-500';
      case 'stopped':
        return 'text-red-500';
      case 'restarting':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getMetricColor = (value: number) => {
    if (value > 90) return 'bg-red-500';
    if (value > 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard
          icon={Cpu}
          label="CPU Usage"
          value={`${mockMetrics.cpu.toFixed(1)}%`}
          progress={mockMetrics.cpu}
        />
        <MetricCard
          icon={MemoryStick}
          label="Memory"
          value={`${mockMetrics.memory.toFixed(1)}%`}
          progress={mockMetrics.memory}
        />
        <MetricCard
          icon={Activity}
          label="GPU Usage"
          value={`${mockMetrics.gpu.toFixed(1)}%`}
          progress={mockMetrics.gpu}
        />
        <MetricCard
          icon={HardDrive}
          label="Disk Usage"
          value={`${mockMetrics.disk.toFixed(1)}%`}
          progress={mockMetrics.disk}
        />
        <MetricCard
          icon={Network}
          label="Network"
          value={`${mockMetrics.network.toFixed(1)}%`}
          progress={mockMetrics.network}
        />
        <MetricCard
          icon={BarChart}
          label="Requests"
          value={mockMetrics.requests.toString()}
          progress={0}
          hideProgress
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-purple-500/20">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-purple-400" />
            <span className="text-gray-400">Container ID</span>
          </div>
          <span className="font-mono text-purple-300">{containerId}</span>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-purple-500/20">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="text-gray-400">Deployed On</span>
          </div>
          <span className="text-purple-300">{new Date(deployedOn).toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-purple-500/20">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-purple-400" />
            <span className="text-gray-400">Status</span>
          </div>
          <span className={`font-semibold ${getStatusColor(status)}`}>{status}</span>
        </div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-4">
      <div className="h-[300px] overflow-y-auto font-mono text-sm bg-black/40 rounded-lg p-4 border border-purple-500/20">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No logs available
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex gap-2 text-gray-300 hover:bg-purple-500/10 p-1 rounded">
              <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span>
              <span>{log}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(mockMetrics).map(([key, value]) => (
          <div key={key} className="p-4 rounded-lg bg-black/20 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 capitalize">{key}</span>
              <span className="text-purple-300">
                {key === 'requests' ? value : `${value.toFixed(1)}%`}
              </span>
            </div>
            {key !== 'requests' && (
              <Progress
                value={value}
                className="h-2 bg-purple-500/20"
                indicatorClassName={getMetricColor(value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Deployment Status</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            className="bg-black/40 border-purple-500/20 hover:border-purple-500/40"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Restart
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsConfirmingDestroy(true)}
                  className="bg-black/40 border-red-500/20 hover:border-red-500/40 text-red-400"
                >
                  <Power className="w-4 h-4 mr-2" />
                  Destroy
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This action cannot be undone</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {isConfirmingDestroy && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span>Are you sure you want to destroy this deployment?</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmingDestroy(false)}
              className="border-gray-500/20"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setIsConfirmingDestroy(false);
                onDestroy?.();
              }}
            >
              Confirm Destroy
            </Button>
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-4 border-b border-gray-800">
        {(['overview', 'logs', 'metrics'] as const).map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            className={`relative px-4 py-2 capitalize ${
              selectedTab === tab
                ? 'text-purple-400'
                : 'text-gray-400 hover:text-purple-400'
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {selectedTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
              />
            )}
            {tab}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {selectedTab === 'overview' && renderOverview()}
          {selectedTab === 'logs' && renderLogs()}
          {selectedTab === 'metrics' && renderMetrics()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  progress,
  hideProgress
}: {
  icon: any;
  label: string;
  value: string;
  progress: number;
  hideProgress?: boolean;
}) {
  return (
    <Card className="p-4 bg-black/20 border-purple-500/20">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        <span className="text-sm font-medium text-purple-300">{value}</span>
      </div>
      {!hideProgress && (
        <Progress
          value={progress}
          className="h-1 bg-purple-500/20"
          indicatorClassName={
            progress > 90
              ? 'bg-red-500'
              : progress > 70
              ? 'bg-yellow-500'
              : 'bg-green-500'
          }
        />
      )}
    </Card>
  );
}

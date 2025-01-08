'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { GPUStats } from '@/services/types';
import { Cpu, Zap, TrendingUp, Clock, AlertCircle, Settings, Calculator } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface GPUScannerProps {
  onComplete: (duration: number) => void;
  gpuStats: GPUStats;
}

interface EarningEstimate {
  duration: number;
  earnings: number;
  powerCost: number;
  netEarnings: number;
  efficiency: 'High' | 'Medium' | 'Low';
  hashrate: number;
  powerUsage: number;
}

export const GPUScanner: React.FC<GPUScannerProps> = ({ onComplete, gpuStats }) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [estimates, setEstimates] = useState<EarningEstimate[]>([]);
  const [showCustomPlan, setShowCustomPlan] = useState(false);
  const [customDuration, setCustomDuration] = useState(6);
  const [customPowerLimit, setCustomPowerLimit] = useState(100);

  // Simulate GPU scanning
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false);
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isScanning]);

  // Calculate estimates when scan completes
  useEffect(() => {
    if (scanProgress === 100) {
      const baseHashrate = (gpuStats.totalMemory * 50) + (gpuStats.powerDraw * 0.2);
      const baseEarningRate = (gpuStats.totalMemory * 0.15) + (gpuStats.powerDraw * 0.05);
      
      const estimates: EarningEstimate[] = [
        {
          duration: 3,
          earnings: baseEarningRate * 3,
          powerCost: gpuStats.powerDraw * 0.12 * 3,
          netEarnings: 0,
          efficiency: 'Low',
          hashrate: baseHashrate * 0.9,
          powerUsage: gpuStats.powerDraw * 0.9
        },
        {
          duration: 6,
          earnings: baseEarningRate * 6.5,
          powerCost: gpuStats.powerDraw * 0.12 * 6,
          netEarnings: 0,
          efficiency: 'Medium',
          hashrate: baseHashrate,
          powerUsage: gpuStats.powerDraw
        },
        {
          duration: 10,
          earnings: baseEarningRate * 11,
          powerCost: gpuStats.powerDraw * 0.12 * 10,
          netEarnings: 0,
          efficiency: 'High',
          hashrate: baseHashrate * 1.1,
          powerUsage: gpuStats.powerDraw * 1.05
        }
      ];

      setEstimates(estimates.map(est => ({
        ...est,
        netEarnings: est.earnings - est.powerCost
      })));
    }
  }, [scanProgress, gpuStats]);

  const calculateCustomEstimate = (): EarningEstimate => {
    const baseEstimate = estimates[1]; // Use 6h as base
    const powerFactor = customPowerLimit / 100;
    
    return {
      duration: customDuration,
      earnings: (baseEstimate.earnings / 6) * customDuration * powerFactor,
      powerCost: (baseEstimate.powerCost / 6) * customDuration * powerFactor,
      netEarnings: 0,
      efficiency: powerFactor > 0.9 ? 'High' : powerFactor > 0.7 ? 'Medium' : 'Low',
      hashrate: baseEstimate.hashrate * powerFactor,
      powerUsage: baseEstimate.powerUsage * powerFactor
    };
  };

  return (
    <div className="space-y-6">
      {isScanning ? (
        <Card className="p-6 bg-[#1A1A1A] border-gray-800">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Scanning GPU Capabilities</h2>
            <div className="space-y-2">
              <Progress value={scanProgress} className="h-2" />
              <p className="text-sm text-gray-400">Analyzing GPU performance and power characteristics...</p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card className="p-6 bg-[#1A1A1A] border-gray-800">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">GPU Analysis Results</h2>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-400">Optimal Configuration Found</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-400">GPU Model</span>
                  </div>
                  <p className="text-xl font-bold text-white">{gpuStats.model}</p>
                  <p className="text-sm text-gray-500">Performance Tier: High</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-400">Power Efficiency</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {(gpuStats.powerDraw / gpuStats.totalMemory).toFixed(1)} W/GB
                  </p>
                  <p className="text-sm text-gray-500">Optimal Range</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-gray-400">Earning Potential</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {(estimates[2]?.earnings / 10).toFixed(1)} NLOV/h
                  </p>
                  <p className="text-sm text-gray-500">At Maximum Efficiency</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-400">ROI Estimate</span>
                  </div>
                  <p className="text-xl font-bold text-white">85%</p>
                  <p className="text-sm text-gray-500">Net Profit Ratio</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {estimates.map((estimate, index) => (
              <Card 
                key={index}
                className={`p-6 ${
                  estimate.efficiency === 'High' 
                    ? 'bg-gradient-to-br from-green-900/50 to-[#1A1A1A] border-green-600/30'
                    : 'bg-[#1A1A1A] border-gray-800'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold text-white">{estimate.duration}h Session</span>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      estimate.efficiency === 'High' 
                        ? 'bg-green-500/20 text-green-400'
                        : estimate.efficiency === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                    }`}>
                      {estimate.efficiency} Efficiency
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-400">Estimated Earnings</span>
                      <p className="text-2xl font-bold text-green-500">{estimate.earnings.toFixed(2)} NLOV</p>
                      <p className="text-sm text-gray-500">${(estimate.earnings * 1.2).toFixed(2)} USD</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Power Cost</span>
                      <p className="text-lg font-semibold text-red-500">-${estimate.powerCost.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{estimate.powerUsage.toFixed(0)}W Avg</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Net Earnings</span>
                      <p className="text-xl font-bold text-blue-500">{estimate.netEarnings.toFixed(2)} NLOV</p>
                      <p className="text-sm text-gray-500">${(estimate.netEarnings * 1.2).toFixed(2)} USD</p>
                    </div>
                    <div className="pt-2 border-t border-gray-800">
                      <span className="text-sm text-gray-400">Performance Metrics</span>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-500">Hashrate</span>
                        <span className="text-white">{(estimate.hashrate / 1000).toFixed(1)} GH/s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Power Draw</span>
                        <span className="text-white">{estimate.powerUsage.toFixed(0)}W</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => onComplete(estimate.duration)}
                    className={`w-full ${
                      estimate.efficiency === 'High'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Select {estimate.duration}h Plan
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowCustomPlan(true)}
              className="border-blue-500/50 hover:border-blue-500"
            >
              <Settings className="w-4 h-4 mr-2" />
              Create Custom Plan
            </Button>
          </div>

          <Dialog open={showCustomPlan} onOpenChange={setShowCustomPlan}>
            <DialogContent className="bg-[#1A1A1A] border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white">
                  Custom Mining Plan
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Customize your mining schedule and power settings
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-400">
                    Session Duration (hours)
                  </label>
                  <div className="flex gap-4">
                    <Slider
                      value={[customDuration]}
                      onValueChange={([value]) => setCustomDuration(value)}
                      max={24}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(Number(e.target.value))}
                      className="w-20 bg-gray-900 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-400">
                    Power Limit (%)
                  </label>
                  <div className="flex gap-4">
                    <Slider
                      value={[customPowerLimit]}
                      onValueChange={([value]) => setCustomPowerLimit(value)}
                      max={100}
                      min={50}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={customPowerLimit}
                      onChange={(e) => setCustomPowerLimit(Number(e.target.value))}
                      className="w-20 bg-gray-900 border-gray-700"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-gray-900/50 border border-gray-800">
                  <h4 className="font-medium text-white mb-4">Estimated Performance</h4>
                  {(() => {
                    const estimate = calculateCustomEstimate();
                    return (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Earnings</span>
                          <span className="text-green-500">{estimate.earnings.toFixed(2)} NLOV</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Power Cost</span>
                          <span className="text-red-500">-${estimate.powerCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Net Earnings</span>
                          <span className="text-blue-500">
                            {(estimate.earnings - estimate.powerCost).toFixed(2)} NLOV
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Hashrate</span>
                          <span className="text-white">
                            {(estimate.hashrate / 1000).toFixed(1)} GH/s
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setShowCustomPlan(false);
                    onComplete(customDuration);
                  }}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Start Custom Plan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

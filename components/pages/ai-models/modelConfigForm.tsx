import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';
import { Save, RefreshCw, Cpu } from 'lucide-react';

interface ModelConfigFormProps {
  modelId: string;
}

export const ModelConfigForm = ({ modelId }: ModelConfigFormProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Model Parameters */}
      <Card className="p-6 bg-black/40 border-blue-500/20 lg:col-span-2">
        <h3 className="text-lg font-semibold text-blue-400 mb-6">Model Parameters</h3>
        
        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-400">Model Version</Label>
                <Select defaultValue="latest">
                  <SelectTrigger className="bg-black/40 border-blue-500/20">
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-blue-500/20">
                    <SelectItem value="latest">Latest (v2.0)</SelectItem>
                    <SelectItem value="v1.5">Version 1.5</SelectItem>
                    <SelectItem value="v1.0">Version 1.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm text-gray-400">Precision</Label>
                <Select defaultValue="fp16">
                  <SelectTrigger className="bg-black/40 border-blue-500/20">
                    <SelectValue placeholder="Select precision" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-blue-500/20">
                    <SelectItem value="fp16">FP16</SelectItem>
                    <SelectItem value="fp32">FP32</SelectItem>
                    <SelectItem value="int8">INT8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-400">Model Endpoint</Label>
              <Input 
                placeholder="https://api.example.com/v1/models/inference"
                className="bg-black/40 border-blue-500/20"
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-400">Advanced Settings</h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm text-gray-400">Batch Size</Label>
                  <span className="text-sm text-blue-400">32</span>
                </div>
                <Slider
                  defaultValue={[32]}
                  max={128}
                  step={1}
                  className="[&_[role=slider]]:bg-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm text-gray-400">Sequence Length</Label>
                  <span className="text-sm text-blue-400">512</span>
                </div>
                <Slider
                  defaultValue={[512]}
                  max={2048}
                  step={64}
                  className="[&_[role=slider]]:bg-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Optimization Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-400">Optimization</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm text-gray-300">Enable Dynamic Batching</Label>
                <p className="text-xs text-gray-500">Automatically batch requests for better throughput</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm text-gray-300">Use Kernel Fusion</Label>
                <p className="text-xs text-gray-500">Optimize CUDA kernels for faster inference</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <Button 
            variant="outline"
            className="border-blue-500/20 hover:bg-blue-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Hardware Configuration */}
      <Card className="p-6 bg-black/40 border-blue-500/20">
        <h3 className="text-lg font-semibold text-blue-400 mb-6">Hardware Configuration</h3>
        
        <div className="space-y-6">
          <div>
            <Label className="text-sm text-gray-400">Compute Type</Label>
            <Select defaultValue="gpu">
              <SelectTrigger className="bg-black/40 border-blue-500/20">
                <SelectValue placeholder="Select compute" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-blue-500/20">
                <SelectItem value="gpu">GPU (NVIDIA A100)</SelectItem>
                <SelectItem value="cpu">CPU (AMD EPYC)</SelectItem>
                <SelectItem value="tpu">TPU v4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-400">Memory Allocation</Label>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-blue-400">16 GB</span>
            </div>
            <Slider
              defaultValue={[16]}
              max={32}
              step={1}
              className="[&_[role=slider]]:bg-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-blue-500/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Estimated Cost</span>
              <span className="text-blue-400">$2.50/hour</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Play, 
  Code, 
  Terminal,
  Info,
  Cpu,
  Gauge,
  Sliders
} from 'lucide-react';
import { ModelConfigForm } from '@/components/pages/ai-models/modelConfigForm';
import { ModelPlayground } from '@/components/pages/ai-models/modelPlayground';
import { ModelInfo } from '@/components/pages/ai-models/modelInfo';
import { ModelMetrics } from '@/components/pages/ai-models/modelMetrics';

export default function ModelPage({ params }: { params: { modelId: string } }) {
  const [activeTab, setActiveTab] = useState('playground');

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {params.modelId}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Configure and test your AI model
            </p>
          </div>
          <Button 
            variant="outline"
            className="bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20"
          >
            Deploy Model
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="bg-black/40 border border-blue-500/20 p-1">
            <TabsTrigger 
              value="playground"
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
            >
              <Play className="w-4 h-4 mr-2" />
              Playground
            </TabsTrigger>
            <TabsTrigger 
              value="configuration"
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger 
              value="metrics"
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
            >
              <Gauge className="w-4 h-4 mr-2" />
              Metrics
            </TabsTrigger>
            <TabsTrigger 
              value="info"
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
            >
              <Info className="w-4 h-4 mr-2" />
              Model Info
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="playground" className="m-0">
              <ModelPlayground modelId={params.modelId} />
            </TabsContent>

            <TabsContent value="configuration" className="m-0">
              <ModelConfigForm modelId={params.modelId} />
            </TabsContent>

            <TabsContent value="metrics" className="m-0">
              <ModelMetrics modelId={params.modelId} />
            </TabsContent>

            <TabsContent value="info" className="m-0">
              <ModelInfo modelId={params.modelId} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

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

interface ModelPageClientProps {
  params: { modelId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ModelPageClient({ params, searchParams }: ModelPageClientProps) {
  const [activeTab, setActiveTab] = useState('playground');

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Model: {params.modelId}
          </h1>
          <p className="text-gray-400 mt-2">
            Configure and interact with your AI model
          </p>
        </div>
      </div>

      <Card className="bg-black/40 border-blue-500/20">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-black/40 border-b border-blue-500/20 rounded-none p-0">
            <TabsTrigger 
              value="playground" 
              className="data-[state=active]:bg-blue-500/10 rounded-none border-r border-blue-500/20"
            >
              <Play className="w-4 h-4 mr-2" />
              Playground
            </TabsTrigger>
            <TabsTrigger 
              value="config" 
              className="data-[state=active]:bg-purple-500/10 rounded-none border-r border-blue-500/20"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger 
              value="metrics" 
              className="data-[state=active]:bg-green-500/10 rounded-none border-r border-blue-500/20"
            >
              <Gauge className="w-4 h-4 mr-2" />
              Metrics
            </TabsTrigger>
            <TabsTrigger 
              value="info" 
              className="data-[state=active]:bg-yellow-500/10 rounded-none"
            >
              <Info className="w-4 h-4 mr-2" />
              Info
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="playground" className="m-0">
              <ModelPlayground modelId={params.modelId} />
            </TabsContent>

            <TabsContent value="config" className="m-0">
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
      </Card>
    </div>
  );
}

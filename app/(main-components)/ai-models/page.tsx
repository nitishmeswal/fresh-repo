'use client';

import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Image as ImageIcon, Zap, Box, Video, Brain, MessageSquare, Music, Clock, Upload, GitBranch, Boxes, Bot, Cpu, X, RefreshCw, MemoryStick, Activity, Info, Power, Grid, Terminal, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DockerConfig } from '@/components/deployment/DockerConfig';
import { NetworkVolume } from '@/components/deployment/NetworkVolume';
import { GPUSelection } from '@/components/deployment/GPUSelection';
import { DeploymentStatus } from '@/components/deployment/DeploymentStatus';
import { FilterMenu } from '@/components/FilterMenu';
import { ModelCard } from '@/components/ModelCard';
import { CustomModelCard } from '@/components/CustomModelCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ModelOverview } from '@/components/pages/ai-models/modelOverview';
import { ModelLogs } from '@/components/pages/ai-models/modelLogs';
import { ModelMetrics } from '@/components/pages/ai-models/modelMetrics';
import type { DockerConfigType, NetworkVolumeType, GPUSelectionType, DeploymentStatusType, AIModel } from '@/services/types';

const defaultDockerConfig: DockerConfigType = {
  templateName: '',
  containerImage: '',
  exposedPorts: [],
  containerDisk: 10,
  volumeDisk: 20,
  minVram: 8
};

const defaultNetworkVolume: NetworkVolumeType = {
  volumeName: '',
  diskSize: 10,
  volumeType: 'local'
};

const filterOptions = {
  category: {
    name: "Category",
    filters: [
      "All",
      "Image Generation",
      "API Services",
      "AI Agents",
      "Video Processing",
      "Model Serving",
      "Language Models",
      "3D Generation",
      "Real-time AI",
      "Audio Processing",
      "Custom"
    ]
  }
};

const categoryToType = {
  "All": "all",
  "Image Generation": "image",
  "API Services": "api",
  "AI Agents": "agent",
  "Video Processing": "video",
  "Model Serving": "server",
  "Language Models": "text",
  "3D Generation": "3d",
  "Real-time AI": "realtime",
  "Audio Processing": "audio",
  "Custom": "custom"
};

const models: AIModel[] = [
  {
    id: 'flux-image',
    name: 'Flux Image Gen',
    description: 'High-performance image generation and manipulation with support for multiple styles and formats',
    type: 'image',
    tags: ['Image Generation', 'Fast'],
    icon: ImageIcon,
    features: [
      'Multiple style support',
      'Real-time image manipulation',
      'Batch processing',
      'Custom style training'
    ],
    defaultConfig: {
      containerImage: 'fluxai/image-gen:latest',
      exposedPorts: [8080, 3754],
      minDisk: 10,
      minVram: 24
    }
  },
  {
    id: 'fast-api',
    name: 'Fast API',
    description: 'High-speed API development and deployment with automatic documentation',
    type: 'api',
    tags: ['Fast', 'API'],
    icon: Zap,
    features: [
      'Automatic API documentation',
      'High-performance endpoints',
      'OpenAPI integration',
      'Real-time validation'
    ],
    defaultConfig: {
      containerImage: 'tiangolo/uvicorn-gunicorn-fastapi:python3.9',
      exposedPorts: [8000],
      minDisk: 5,
      minVram: 8
    }
  },
  {
    id: 'super-agents',
    name: 'AI Super Agents',
    description: 'Advanced AI agents for task automation and decision making',
    type: 'agent',
    tags: ['Agents', 'Automation'],
    icon: Bot,
    features: [
      'Multi-agent coordination',
      'Task automation',
      'Decision making',
      'Learning capabilities'
    ],
    defaultConfig: {
      containerImage: 'fluxai/super-agents:latest',
      exposedPorts: [8080, 5000],
      minDisk: 20,
      minVram: 16
    }
  },
  {
    id: 'deepfake',
    name: 'Deepfake Studio',
    description: 'Professional video synthesis and face swapping with advanced controls',
    type: 'video',
    tags: ['Video', 'AI'],
    icon: Video,
    features: [
      'Face swapping',
      'Video synthesis',
      'Real-time processing',
      'High-quality output'
    ],
    defaultConfig: {
      containerImage: 'fluxai/deepfake:latest',
      exposedPorts: [8080],
      minDisk: 30,
      minVram: 32
    }
  },
  {
    id: 'pytorch-server',
    name: 'PyTorch Server',
    description: 'Deploy PyTorch models with high performance and scalability',
    type: 'server',
    tags: ['PyTorch', 'Server'],
    icon: Brain,
    features: [
      'Model serving',
      'Dynamic batching',
      'GPU optimization',
      'Model versioning'
    ],
    defaultConfig: {
      containerImage: 'pytorch/pytorch:2.0.0-cuda11.7-cudnn8-runtime',
      exposedPorts: [8000],
      minDisk: 15,
      minVram: 16
    }
  },
  {
    id: 'llm-server',
    name: 'LLM Server',
    description: 'Deploy and serve large language models with optimized inference',
    type: 'text',
    tags: ['LLM', 'Text'],
    icon: MessageSquare,
    features: [
      'Model quantization',
      'Optimized inference',
      'Multi-model serving',
      'Token streaming'
    ],
    defaultConfig: {
      containerImage: 'fluxai/llm-server:latest',
      exposedPorts: [8080],
      minDisk: 100,
      minVram: 48
    }
  },
  {
    id: '3d-server',
    name: '3D Server',
    description: '3D model generation and rendering with real-time capabilities',
    type: '3d',
    tags: ['3D', 'Rendering'],
    icon: Box,
    features: [
      '3D model generation',
      'Real-time rendering',
      'Texture synthesis',
      'Animation support'
    ],
    defaultConfig: {
      containerImage: 'fluxai/3d-server:latest',
      exposedPorts: [8080, 3754],
      minDisk: 20,
      minVram: 24
    }
  },
  {
    id: 'realtime-server',
    name: 'Realtime AI',
    description: 'Real-time AI processing for streaming and live applications',
    type: 'realtime',
    tags: ['Real-time', 'Streaming'],
    icon: Clock,
    features: [
      'Stream processing',
      'Low latency inference',
      'Auto-scaling',
      'Live monitoring'
    ],
    defaultConfig: {
      containerImage: 'fluxai/realtime:latest',
      exposedPorts: [8080, 5000],
      minDisk: 15,
      minVram: 16
    }
  },
  {
    id: 'audio-server',
    name: 'Audio Server',
    description: 'Audio processing and generation with support for multiple formats',
    type: 'audio',
    tags: ['Audio', 'Generation'],
    icon: Music,
    features: [
      'Audio generation',
      'Format conversion',
      'Real-time processing',
      'Voice synthesis'
    ],
    defaultConfig: {
      containerImage: 'fluxai/audio:latest',
      exposedPorts: [8080],
      minDisk: 20,
      minVram: 16
    }
  },
  {
    id: 'custom-model',
    name: 'Custom Model',
    description: 'Deploy your own AI model with custom configuration',
    type: 'custom',
    tags: ['Custom', 'Flexible'],
    icon: Upload,
    features: [
      'Custom model deployment',
      'Flexible configuration',
      'Resource optimization',
      'API customization'
    ],
    defaultConfig: {
      containerImage: 'nvidia/cuda:11.8.0-runtime-ubuntu22.04',
      exposedPorts: [8080],
      minDisk: 10,
      minVram: 8
    }
  }
];

const gpuOptions: GPUSelectionType[] = [
  {
    model: 'NVIDIA RTX 5090',
    vram: 32,
    cores: 18432,
    tflops: 98.5,
    pricePerHour: 3.99
  },
  {
    model: 'NVIDIA RTX 4090',
    vram: 24,
    cores: 16384,
    tflops: 82.6,
    pricePerHour: 2.99
  },
  {
    model: 'NVIDIA RTX 3090 Ti',
    vram: 24,
    cores: 10752,
    tflops: 40,
    pricePerHour: 1.79
  },
  {
    model: 'NVIDIA RTX 3090',
    vram: 24,
    cores: 10496,
    tflops: 35.6,
    pricePerHour: 1.49
  }
];

export default function AIModelsPage() {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [step, setStep] = useState<'models' | 'docker' | 'volume' | 'gpu' | 'status'>('models');
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dockerConfig, setDockerConfig] = useState<DockerConfigType>(defaultDockerConfig);
  const [networkVolume, setNetworkVolume] = useState<NetworkVolumeType>(defaultNetworkVolume);
  const [selectedGpu, setSelectedGpu] = useState<GPUSelectionType | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatusType | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'metrics'>('overview');

  // Memoize filtered models to prevent unnecessary recalculations
  const filteredModels = useMemo(() => {
    if (selectedCategory === "All") return models;
    return models.filter(model => 
      categoryToType[selectedCategory as keyof typeof categoryToType] === model.type
    );
  }, [selectedCategory]);

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
    setStep('docker');
  };

  const handleDeploy = () => {
    setDeploymentStatus({
      containerId: '64900000f78ee474',
      containerName: dockerConfig.templateName,
      status: 'running',
      deployedOn: new Date().toLocaleString(),
      logs: [],
      metrics: {
        cpu: 54.3,
        memory: 60.7,
        gpu: 84.0,
        disk: 32.3,
        network: 12.3,
        requests: 155
      }
    });
    setStep('status');
  };

  const renderStep = () => {
    switch (step) {
      case 'models':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <div key={model.id} className="transition-transform hover:-translate-y-1 duration-200">
                  {model.type === 'custom' ? (
                    <CustomModelCard
                      model={model}
                      onDeploy={handleModelSelect}
                    />
                  ) : (
                    <ModelCard
                      model={model}
                      onDeploy={handleModelSelect}
                    />
                  )}
                </div>
              ))}
              
              {filteredModels.length === 0 && (
                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-blue-500/5 rounded-full" />
                    </div>
                    <Cpu className="w-12 h-12 mx-auto text-blue-400/60 mb-4 relative z-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-300/80 mb-2">No Models Found</h3>
                  <p className="text-blue-300/60">Try adjusting your filters to find more AI models</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'docker':
        return (
          <DockerConfig
            config={dockerConfig}
            onUpdate={setDockerConfig}
            onNext={() => setStep('volume')}
          />
        );
      case 'volume':
        return (
          <NetworkVolume
            config={networkVolume}
            onUpdate={setNetworkVolume}
            onNext={() => setStep('gpu')}
            onBack={() => setStep('docker')}
          />
        );
      case 'gpu':
        return (
          <GPUSelection
            options={gpuOptions}
            selectedGpu={selectedGpu}
            onSelect={setSelectedGpu}
            onNext={handleDeploy}
            onBack={() => setStep('volume')}
          />
        );
      case 'status':
        return (
          <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Header */}
            <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-blue-500/20">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      AI Models Deployment
                    </h1>
                    <div className="flex items-center mt-1 space-x-4">
                      <span className="text-sm text-gray-400">Category: {selectedCategory}</span>
                      <span className="text-sm text-gray-400">{filteredModels.length} models found</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      className="border-blue-500/20 hover:bg-blue-500/10"
                      onClick={() => {
                        setDeploymentStatus({
                          ...deploymentStatus!,
                          status: 'restarting'
                        });
                        setTimeout(() => {
                          setDeploymentStatus({
                            ...deploymentStatus!,
                            status: 'running'
                          });
                        }, 2000);
                      }}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Restart
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-red-500/20 hover:bg-red-500/10 text-red-400"
                      onClick={() => {
                        setDeploymentStatus(null);
                        setStep('models');
                      }}
                    >
                      <Power className="w-4 h-4 mr-2" />
                      Destroy
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
              <div className="grid grid-cols-1 gap-6">
                <Card className="p-6 bg-black/40 border-blue-500/20">
                  <Tabs 
                    defaultValue={activeTab} 
                    onValueChange={setActiveTab as any}
                    className="w-full"
                  >
                    <TabsList className="bg-black/40 border border-blue-500/20 p-1">
                      <TabsTrigger 
                        value="overview"
                        className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
                      >
                        <Info className="w-4 h-4 mr-2" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger 
                        value="logs"
                        className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
                      >
                        <Terminal className="w-4 h-4 mr-2" />
                        Logs
                      </TabsTrigger>
                      <TabsTrigger 
                        value="metrics"
                        className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Metrics
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                      <TabsContent value="overview" className="m-0">
                        <ModelOverview />
                      </TabsContent>

                      <TabsContent value="logs" className="m-0">
                        <ModelLogs />
                      </TabsContent>

                      <TabsContent value="metrics" className="m-0">
                        <ModelMetrics />
                      </TabsContent>
                    </div>
                  </Tabs>
                </Card>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-1 w-full min-h-screen flex-col">
      {/* Header with filter */}
      <div className="sticky top-0 z-40 flex justify-between items-center p-4 border-b border-blue-500/20 backdrop-blur-xl bg-black/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              AI Models
            </h1>
            <div className="relative">
              <span className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse">
                Beta
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-xl rounded-full"></div>
            </div>
          </div>
          <FilterMenu
            name="Category"
            filters={filterOptions.category.filters}
            onSelect={(value) => setSelectedCategory(value)}
          />
          {selectedCategory !== "All" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory("All")}
              className="text-sm bg-black/40 border-blue-500/20 hover:border-blue-500/40 text-blue-300 hover:text-blue-200"
            >
              <span className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Reset Filter
              </span>
            </Button>
          )}
        </div>

        <div className="text-sm text-blue-300/60">
          {filteredModels.length} {filteredModels.length === 1 ? 'model' : 'models'} found
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

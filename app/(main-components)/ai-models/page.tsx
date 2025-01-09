'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Zap, Box, Video, Brain, MessageSquare, Music, Clock, Upload, GitBranch, Boxes, Bot, Cpu, X, Loader2, Check, AlertCircle, Activity, Cpu as CpuIcon, MemoryStick, Network, HardDrive, Users, Download, Compass, Filter, CheckCircle, BarChart2, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AIModel } from '@/services/types';
import { useCreditsContext } from '@/contexts/credits-context';
import { FluxImageGenerator } from '@/components/pages/AiModel/FluxImage/FluxImageGenerator';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { DockerConfig } from '@/components/deployment/DockerConfig';
import { GPUSelection } from '@/components/deployment/GPUSelection';
import { NetworkVolume } from '@/components/deployment/NetworkVolume';
import { DeploymentStatus } from '@/components/pages/AiModel/CustomModel/DeploymentStatus';
import { ModelMetrics } from '@/components/pages/AiModel/CustomModel/ModelMetrics';
import { ModelLogs } from '@/components/pages/AiModel/CustomModel/ModelLogs';
import type { DockerConfigType, GPUSelectionType, NetworkVolumeType } from '@/services/types';

const defaultDockerConfig: DockerConfigType = {
  templateName: '',
  containerImage: '',
  exposedPorts: [],
  containerDisk: 10,
  volumeDisk: 20,
  minVram: 8
};

const defaultNetworkVolume = {
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
  },
  view: {
    options: ["explore", "my-models"],
    labels: {
      explore: "Explore Models",
      "my-models": "My Models"
    }
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

const models = [
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

type DeploymentStep = {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  message: string;
};

const deploymentSteps: DeploymentStep[] = [
  {
    id: 'docker',
    name: 'Docker Configuration',
    status: 'pending',
    message: 'Configure container settings'
  },
  {
    id: 'network',
    name: 'Network Setup',
    status: 'pending',
    message: 'Configure network and endpoint settings'
  },
  {
    id: 'gpu',
    name: 'GPU Selection',
    status: 'pending',
    message: 'Select GPU resources for your model'
  },
  {
    id: 'deployment',
    name: 'Deployment Progress',
    status: 'pending',
    message: 'Deploying your model...'
  }
];

export default function AIModelsPage() {
  const { credits } = useCreditsContext();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentStep, setCurrentStep] = useState<'docker' | 'network' | 'gpu' | 'deployment'>('docker');
  const [dockerConfig, setDockerConfig] = useState<DockerConfigType>(defaultDockerConfig);
  const [selectedGpu, setSelectedGpu] = useState<GPUSelectionType | null>(null);
  const [networkConfig, setNetworkConfig] = useState<NetworkVolumeType | null>(null);
  const [deploymentStepsState, setDeploymentSteps] = useState<DeploymentStep[]>(deploymentSteps);
  const [showMonitoringView, setShowMonitoringView] = useState(false);
  const [view, setView] = useState<'explore' | 'my-models'>('explore');
  const [myModels, setMyModels] = useState<Model[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const updateStepStatus = (stepId: string, status: DeploymentStep['status']) => {
    setDeploymentSteps(steps =>
      steps.map(step =>
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
    setShowDeployModal(true);
    setCurrentStep('docker');
  };

  const handleNext = () => {
    if (currentStep === 'docker') {
      setCurrentStep('network');
    } else if (currentStep === 'network') {
      setCurrentStep('gpu');
    } else if (currentStep === 'gpu') {
      setCurrentStep('deployment');
      handleDeployment();
    }
  };

  const handleDeployment = async () => {
    try {
      setIsDeploying(true);

      // Docker Configuration
      updateStepStatus('docker', 'in-progress');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStepStatus('docker', 'completed');

      // Network Setup
      updateStepStatus('network', 'in-progress');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStepStatus('network', 'completed');

      // GPU Selection
      updateStepStatus('gpu', 'in-progress');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStepStatus('gpu', 'completed');

      // Deployment Progress
      updateStepStatus('deployment', 'in-progress');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus('deployment', 'completed');

      toast.success(`${selectedModel?.name} deployed successfully!`);
    } catch (error) {
      console.error('Deployment failed:', error);
      deploymentStepsState.forEach(step => {
        if (step.status === 'in-progress') {
          updateStepStatus(step.id, 'failed');
        }
      });
      toast.error("Deployment failed. Please try again.");
    } finally {
      setIsDeploying(false);
    }
  };

  const filteredModels = useMemo(() => {
    if (selectedCategory === "All") return models;
    return models.filter(model =>
      categoryToType[selectedCategory as keyof typeof categoryToType] === model.type
    );
  }, [selectedCategory]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="container mx-auto py-8 px-4">
          {/* Header with filter */}
          <div className="sticky top-0 z-40 flex flex-col gap-4 p-4 border-b border-blue-500/20 backdrop-blur-xl bg-black/40">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    AI Models
                  </h1>
                  <div className="relative">
                    <span className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse">
                      Beta
                    </span>
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-blue-500/20">
                  <Button
                    variant={view === 'explore' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setView('explore')}
                    className={`text-sm ${
                      view === 'explore'
                        ? "bg-blue-500/20 text-blue-300"
                        : "hover:bg-blue-500/10 text-blue-300/60 hover:text-blue-300"
                    }`}
                  >
                    <Compass className="w-4 h-4 mr-2" />
                    Explore Models
                  </Button>
                  <Button
                    variant={view === 'my-models' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setView('my-models')}
                    className={`text-sm ${
                      view === 'my-models'
                        ? "bg-blue-500/20 text-blue-300"
                        : "hover:bg-blue-500/10 text-blue-300/60 hover:text-blue-300"
                    }`}
                  >
                    <Box className="w-4 h-4 mr-2" />
                    My Models
                  </Button>
                </div>

                {view === 'explore' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                    className="text-sm hover:bg-blue-500/10 text-blue-300/60 hover:text-blue-300"
                  >
                    <Filter className={`w-4 h-4 mr-2 transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`} />
                    Filters
                  </Button>
                )}
              </div>

              <div className="text-sm text-blue-300/60">
                {view === 'explore' 
                  ? `${filteredModels.length} ${filteredModels.length === 1 ? 'model' : 'models'} found`
                  : `${myModels.length} ${myModels.length === 1 ? 'model' : 'models'} deployed`
                }
              </div>
            </div>

            {/* Collapsible Filters */}
            {view === 'explore' && isFilterExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-2 pt-2"
              >
                {filterOptions.category.filters.map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedCategory === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(filter)}
                    className={`text-sm ${
                      selectedCategory === filter
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-black/40 border-blue-500/20 hover:border-blue-500/40 text-blue-300 hover:text-blue-200"
                    }`}
                  >
                    {filter}
                  </Button>
                ))}

                {selectedCategory !== "All" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory("All")}
                    className="text-sm bg-black/40 border-blue-500/20 hover:border-blue-500/40 text-blue-300 hover:text-blue-200"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                )}
              </motion.div>
            )}
          </div>

          {/* Main content */}
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels.map((model) => (
                  <motion.div
                    key={model.id}
                    className="transition-transform hover:-translate-y-1 duration-200 h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={`p-6 relative overflow-hidden group h-full flex flex-col ${
                      model.id === 'flux-image' || model.id === 'custom-model'
                        ? 'bg-black/40 border-blue-500/20'
                        : 'bg-black/40 border-purple-500/20'
                    }`}>
                      {/* Animated gradient background */}
                      <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-200 ${
                        model.id === 'flux-image' || model.id === 'custom-model'
                          ? 'from-blue-500/5 to-purple-500/5 group-hover:opacity-100 opacity-0'
                          : 'from-purple-500/5 to-pink-500/5 group-hover:opacity-100 opacity-0'
                      }`} />
                      
                      {/* Animated glow effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-xl" />
                      </div>

                      {/* Coming Soon Overlay for locked models */}
                      {model.id !== 'flux-image' && model.id !== 'custom-model' && (
                        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40 z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent"
                          >
                            Coming Soon
                          </motion.div>
                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm text-purple-300/60 mt-2 text-center px-4"
                          >
                            This powerful AI model will be available soon
                          </motion.div>
                        </div>
                      )}
                      
                      <div className="relative flex flex-col flex-grow">
                        <div className="flex items-center gap-4 mb-4">
                          {React.createElement(model.icon, { 
                            className: `w-6 h-6 ${
                              model.id === 'flux-image' || model.id === 'custom-model'
                                ? 'text-blue-400'
                                : 'text-purple-400'
                            }`
                          })}
                          <h2 className={`text-xl font-semibold ${
                            model.id === 'flux-image' || model.id === 'custom-model'
                              ? 'text-blue-300'
                              : 'text-purple-300'
                          }`}>{model.name}</h2>
                        </div>
                        
                        <p className={`mb-4 ${
                          model.id === 'flux-image' || model.id === 'custom-model'
                            ? 'text-blue-300/60'
                            : 'text-purple-300/60'
                        }`}>{model.description}</p>
                        
                        {model.features && (
                          <div className="mb-4">
                            <h3 className={`text-sm font-semibold mb-2 ${
                              model.id === 'flux-image' || model.id === 'custom-model'
                                ? 'text-blue-300'
                                : 'text-purple-300'
                            }`}>Features</h3>
                            <ul className="space-y-1">
                              {model.features.map((feature, index) => (
                                <li key={index} className={`text-sm flex items-center gap-2 ${
                                  model.id === 'flux-image' || model.id === 'custom-model'
                                    ? 'text-blue-300/60'
                                    : 'text-purple-300/60'
                                }`}>
                                  <div className={`w-1 h-1 rounded-full ${
                                    model.id === 'flux-image' || model.id === 'custom-model'
                                      ? 'bg-blue-400/60'
                                      : 'bg-purple-400/60'
                                  }`} />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {model.id === 'flux-image' && (
                          <div className="mt-auto">
                            <FluxImageGenerator />
                          </div>
                        )}

                        {(model.id === 'flux-image' || model.id === 'custom-model') && (
                          <div className="mt-4 flex flex-col gap-4">
                            <Button
                              onClick={() => handleModelSelect(model)}
                              disabled={isDeploying}
                              className={`w-full group relative overflow-hidden py-6 ${
                                model.id === 'flux-image'
                                  ? 'bg-gradient-to-r from-blue-500/20 via-blue-400/30 to-blue-500/20 hover:from-blue-500/30 hover:via-blue-400/40 hover:to-blue-500/30'
                                  : 'bg-gradient-to-r from-purple-500/20 via-pink-400/30 to-purple-500/20 hover:from-purple-500/30 hover:via-pink-400/40 hover:to-purple-500/30'
                              } border-0 transition-all duration-500 ease-out transform hover:scale-[1.02]`}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className={`absolute inset-0 ${
                                  model.id === 'flux-image'
                                    ? 'bg-blue-500/5'
                                    : 'bg-purple-500/5'
                                }`} />
                              </div>
                              <span className="relative z-10 flex items-center justify-center gap-3 text-lg font-semibold">
                                {isDeploying ? (
                                  <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Deploying...
                                  </>
                                ) : (
                                  <>
                                    <Zap className={`w-5 h-5 ${
                                      model.id === 'flux-image'
                                        ? 'text-blue-400'
                                        : 'text-purple-400'
                                    }`} />
                                    Deploy {model.name}
                                  </>
                                )}
                              </span>
                            </Button>
                          </div>
                        )}

                        {model.tags && (
                          <div className="flex flex-wrap gap-2 mt-auto pt-4">
                            {model.tags.map((tag, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 text-xs font-medium rounded-full border ${
                                  model.id === 'flux-image' || model.id === 'custom-model'
                                    ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                                    : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Animated corner decorations for coming soon models */}
                        {model.id !== 'flux-image' && model.id !== 'custom-model' && (
                          <>
                            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-500/20 to-transparent transform rotate-45 translate-x-8 -translate-y-8" />
                            </div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden">
                              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-500/20 to-transparent transform rotate-45 -translate-x-8 translate-y-8" />
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
                
                {filteredModels.length === 0 && (
                  <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-blue-500/5 rounded-full" />
                      </div>
                      <CpuIcon className="w-12 h-12 mx-auto text-blue-400/60 mb-4 relative z-10" />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-300/80 mb-2">No Models Found</h3>
                    <p className="text-blue-300/60">Try adjusting your filters to find more AI models</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Deployment Modal Content */}
      <AnimatePresence>
        {showDeployModal && selectedModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/80 border border-blue-500/20 rounded-lg p-6 w-full max-w-4xl m-4"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-blue-300">Deploy {selectedModel.name}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => !isDeploying && setShowDeployModal(false)}
                  disabled={isDeploying}
                  className="text-blue-300/60 hover:text-blue-300"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Deployment Steps */}
              {currentStep === 'docker' && (
                <DockerConfig
                  config={dockerConfig}
                  onChange={setDockerConfig}
                  onNext={() => handleNext()}
                  onBack={() => setShowDeployModal(false)}
                />
              )}

              {currentStep === 'network' && (
                <NetworkVolume
                  onNext={() => handleNext()}
                  onBack={() => setCurrentStep('docker')}
                />
              )}

              {currentStep === 'gpu' && (
                <GPUSelection
                  selectedGpu={selectedGpu}
                  onSelect={setSelectedGpu}
                  onNext={() => handleNext()}
                  onBack={() => setCurrentStep('network')}
                />
              )}

              {currentStep === 'deployment' && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
                    <h3 className="text-lg font-semibold text-blue-300">Deploying {selectedModel?.name}</h3>
                    <p className="text-sm text-blue-300/60">This may take a few minutes...</p>
                  </div>
                  <DeploymentStatus steps={deploymentStepsState} currentStep={currentStep} />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Monitoring View */}
      {showMonitoringView && (
        <div className="fixed inset-0 z-50 bg-black/90 overflow-y-auto">
          <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-300">Model Monitoring</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMonitoringView(false)}
                className="text-blue-300/60 hover:text-blue-300"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-black/40 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-blue-300/60">Status</CardTitle>
                      <CardDescription className="text-2xl font-semibold text-blue-300">Active</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="bg-black/40 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-blue-300/60">Uptime</CardTitle>
                      <CardDescription className="text-2xl font-semibold text-blue-300">24h 13m</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="bg-black/40 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-blue-300/60">Active Users</CardTitle>
                      <CardDescription className="text-2xl font-semibold text-blue-300">234</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="bg-black/40 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-blue-300/60">Resource Usage</CardTitle>
                      <CardDescription className="text-2xl font-semibold text-blue-300">78%</CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-blue-300 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <Card key={i} className="bg-black/40 border-blue-500/20">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-blue-400" />
                              </div>
                              <div>
                                <CardTitle className="text-sm font-medium text-blue-300">API Request</CardTitle>
                                <CardDescription className="text-xs text-blue-300/60">200ms response time</CardDescription>
                              </div>
                            </div>
                            <span className="text-xs text-blue-300/60">2 min ago</span>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-black/40 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-blue-300">Inference Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      {/* Add chart here */}
                    </CardContent>
                  </Card>
                  <Card className="bg-black/40 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-blue-300">Requests per Minute</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      {/* Add chart here */}
                    </CardContent>
                  </Card>
                  <Card className="bg-black/40 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-blue-300">Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      {/* Add chart here */}
                    </CardContent>
                  </Card>
                  <Card className="bg-black/40 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-blue-300">Resource Usage</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      {/* Add chart here */}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="logs" className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-blue-300">System Logs</h3>
                  <Button variant="outline" className="bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20">
                    <Download className="w-4 h-4 mr-2" />
                    Export Logs
                  </Button>
                </div>
                <Card className="bg-black/40 border-blue-500/20">
                  <CardContent className="p-4">
                    <pre className="text-sm text-blue-300/60 font-mono whitespace-pre-wrap">
                      {[`[2024-01-09 18:24:21] INFO: Model deployment started`,
                        `[2024-01-09 18:24:22] INFO: Container initialization successful`,
                        `[2024-01-09 18:24:23] INFO: Network configuration applied`,
                        `[2024-01-09 18:24:24] INFO: GPU resources allocated`,
                        `[2024-01-09 18:24:25] INFO: Model loaded successfully`,
                        `[2024-01-09 18:24:26] INFO: API endpoint ready`,
                        `[2024-01-09 18:24:27] INFO: Health check passed`,
                        `[2024-01-09 18:24:28] INFO: Model serving requests`].join('\n')}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Zap, Box, Video, Brain, MessageSquare, Music, Clock, Upload, GitBranch, Boxes, Bot, Cpu, X, Loader2, Check, AlertCircle, Activity, Cpu as CpuIcon, MemoryStick, Network, HardDrive, Users, Download, Compass, Filter, CheckCircle, BarChart2, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import NextImage from 'next/image';
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

  // Image generation states
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inferenceTime, setInferenceTime] = useState<number | null>(null);

  const generateImage = async (modelId: string) => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      setError(null);

      if (!prompt?.trim()) {
        setError('Please enter a prompt');
        return;
      }

      const response = await fetch('https://api.hyperbolic.xyz/v1/image/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuaXRpc2htZXN3YWxAZ21haWwuY29tIiwiaWF0IjoxNzM2NDk4Mzk5fQ.NvMvtg6JrPCIl43h6KP7rDp5n5PedKS2LdjGNnQQiM8'
        },
        body: JSON.stringify({
          'model_name': 'SDXL1.0-base',
          'prompt': prompt.trim(),
          'steps': 30,
          'cfg_scale': 5,
          'enable_refiner': false,
          'height': 1024,
          'width': 1024,
          'backend': 'auto'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      console.log('Full API Response:', data);

      if (!data.images || !data.images[0]) {
        throw new Error('No image data in response');
      }

      const imageData = data.images[0];
      console.log('Image data received:', imageData);
      
      // Convert the base64 image data to a data URL
      const imageUrl = `data:image/png;base64,${imageData.image}`;
      console.log('Generated data URL:', imageUrl);

      setGeneratedImage(imageUrl);
      setInferenceTime(data.inference_time);

    } catch (error) {
      console.error('Error generating image:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

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
    <div className="container mx-auto p-4 relative">
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
              </div>
            </div>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredModels.map((model) => (
              <div key={model.id} className="relative group">
                <Card className="relative bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
                  {/* Original card content */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${model.iconBg || 'bg-blue-500/10'}`}>
                        {React.createElement(model.icon, { 
                          className: 'w-5 h-5 text-blue-400'
                        })}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{model.name}</h3>
                        <p className="text-sm text-gray-400">{model.type}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{model.description}</p>

                  {/* Image Generation UI */}
                  {model.id === 'flux-image' && (
                    <div className="mt-4">
                      <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 text-sm font-medium">Demo Available!</span>
                        </div>
                        <h4 className="text-blue-300 font-medium mb-2">Try Flux Image Gen Demo</h4>
                        <p className="text-sm text-gray-400 mb-3">Experience our powerful image generation capabilities.</p>
                        
                        <div className="space-y-3">
                          <Input
                            placeholder="Enter your image prompt..."
                            className="bg-black/30 border-blue-500/20 hover:border-blue-500/40 transition-colors"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                          />
                          <Button 
                            onClick={() => generateImage(model.id)}
                            disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-300"
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 mr-2" />
                                Generate Image
                              </>
                            )}
                          </Button>
                          {error && (
                            <div className="text-red-400 text-sm mt-2 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              {error}
                            </div>
                          )}
                          {generatedImage && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                              className="mt-4"
                            >
                              <motion.div 
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, type: "spring" }}
                                className="relative w-full aspect-square rounded-lg overflow-hidden border border-blue-500/20 bg-black/30"
                              >
                                <motion.img
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3, delay: 0.2 }}
                                  src={generatedImage}
                                  alt="Generated image"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.error('Error loading image:', e);
                                    setError('Failed to load the generated image');
                                  }}
                                />
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.4 }}
                                  className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent"
                                >
                                  <div className="flex justify-between items-center text-xs text-blue-400">
                                    {inferenceTime && (
                                      <span>Generation time: {inferenceTime.toFixed(2)}s</span>
                                    )}
                                    <button 
                                      onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = generatedImage;
                                        link.download = 'generated-image.png';
                                        link.click();
                                      }}
                                      className="hover:underline flex items-center gap-1 text-blue-300 hover:text-blue-200 transition-colors"
                                    >
                                      <Download className="w-3 h-3" />
                                      Download
                                    </button>
                                  </div>
                                </motion.div>
                              </motion.div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-4">
                    <Button
                      onClick={() => {
                        toast.info('Deployment coming in Version 2.0! 🚀', {
                          description: 'Full model deployment will be available in the next major release.',
                          action: {
                            label: "Notify Me",
                            onClick: () => toast.success('We\'ll notify you when deployment is ready!')
                          }
                        });
                      }}
                      className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 group relative"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Cpu className="w-4 h-4" />
                        Deploy Model
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Search, Filter, Zap, Loader2, ShoppingBag, Star, Info, CheckCircle, Cpu, HardDrive, Box, ImageIcon, Video, Music, Bot, MessageSquare, Rocket, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { models } from './options/models';
import { categoryToType } from './options/constants';
import { ComingSoonOverlay } from '@/components/ComingSoonOverlay';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { GPU, gpuData } from '@/constants/values';
import { GPULabClient } from '@/app/gpulab/gpulab-service';
import { useModelBag } from '@/store/model-bag';
import type { AIModel } from '@/store/model-bag';
import { useUser } from '@/lib/hooks/useUser';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import ModelStatus from "@/app/gpulab/model-status";

const DEV_EMAILS = ['nitishmeswal@gmail.com', 'neohex262@gmail.com'];

const getModelIcon = (type: string) => {
  switch (type) {
    case 'image':
      return <ImageIcon className="w-6 h-6 text-blue-500" />;
    case 'api':
      return <Zap className="w-6 h-6 text-yellow-500" />;
    case 'agent':
      return <Bot className="w-6 h-6 text-purple-500" />;
    case 'audio':
      return <Music className="w-6 h-6 text-pink-500" />;
    case 'video':
      return <Video className="w-6 h-6 text-red-500" />;
    case 'text':
      return <MessageSquare className="w-6 h-6 text-green-500" />;
    case '3d':
      return <Box className="w-6 h-6 text-orange-500" />;
    default:
      return <Brain className="w-6 h-6 text-blue-500" />;
  }
};

export default function AIModelsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const { user } = useUser();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inferenceTime, setInferenceTime] = useState<number | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [view, setView] = useState<'explore' | 'my-models'>('explore');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [modelToView, setModelToView] = useState<AIModel | null>(null);
  const MAX_GENERATIONS = 5;

  const { selectedModel, setSelectedModel } = useModelBag();

  const [deployedContainers, setDeployedContainers] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch deployed containers
  useEffect(() => {
    const fetchContainers = async () => {
      if (view === 'my-models') {
        try {
          const client = GPULabClient.getInstance();
          const containers = await client.getContainerList();
          setDeployedContainers(containers);
        } catch (error) {
          console.error('Error fetching containers:', error);
        }
      }
    };

    fetchContainers();
    const interval = setInterval(fetchContainers, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [view]);

  const handleAddToBag = async (model: AIModel) => {
    try {
      // Special handling for Neurolov image generator
      if (model.id === 'neurolov-image') {
        router.push('/neurolov-image');
        return;
      }

      // Default handling for other models
      setSelectedModel(model);
      
      // Get volume identifier
      const client = GPULabClient.getInstance();
      const volumeIdentifier = await client.getVolumeIdentifier();
      
      // Store in localStorage
      localStorage.setItem('pytorch_deployment', JSON.stringify({
        volume_identifier: volumeIdentifier
      }));
      
      router.push('/gpu-marketplace');
    } catch (error) {
      console.error('Error adding model to bag:', error);
      toast({
        title: "Error",
        description: "Failed to add model to bag. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDemo = async (model: AIModel) => {
    if (model.id === 'flux-image') {
      setIsDemoOpen(true);
    } else if (model.id === 'neurolov-image') {
      router.push('/neurolov-image');
    }
  };

  const filteredModels = useMemo(() => {
    if (selectedCategory === "All") return models;
    return models.filter(model =>
      categoryToType[selectedCategory as keyof typeof categoryToType] === model.type
    );
  }, [selectedCategory]);

  const isDev = user?.email && DEV_EMAILS.includes(user.email);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime(time => Math.max(0, time - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldownTime]);

  const handleDeleteModel = async (container: any) => {
    try {
      setIsDeleting(container.container_address);
      const client = GPULabClient.getInstance();
      await client.deleteContainer(container.container_address);
      toast.success('Model deleted successfully');
      // Refresh the list
      const containers = await client.getContainerList();
      setDeployedContainers(containers);
    } catch (error) {
      console.error('Error deleting model:', error);
      toast.error('Failed to delete model');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
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
                    className={`text-sm ${view === 'explore' ? "bg-blue-500/20 text-blue-300" : "hover:bg-blue-500/10 text-blue-300/60 hover:text-blue-300"}`}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Explore Models
                  </Button>
                  <Button
                    variant={view === 'my-models' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setView('my-models')}
                    className={`text-sm ${view === 'my-models' ? "bg-blue-500/20 text-blue-300" : "hover:bg-blue-500/10 text-blue-300/60 hover:text-blue-300"}`}
                  >
                    <Box className="w-4 h-4 mr-2" />
                    My Models
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ModelStatus />
              </div>
            </div>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {view === 'explore' ? (
              // Explore view - show available models
              models.map((model) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  <Card className="relative h-full bg-[#0A0A0A] border-gray-800 group-hover:border-blue-500/50 transition-all duration-300 overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
                    
                    <CardHeader className="pb-4 relative">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {getModelIcon(model.type)}
                        </motion.div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-100 group-hover:text-blue-400 transition-colors duration-300">
                            {model.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-400">
                            {model.type}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 relative">
                      <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                        {model.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2">
                        {model.features?.map((feature, index) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-2 text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300"
                          >
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 180 }}
                              transition={{ duration: 0.3 }}
                            >
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                            </motion.div>
                            {feature}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="pt-4 border-t border-gray-800 relative">
                      <div className="flex items-center gap-2 w-full">
                        {/* Demo Button only for Flux Image */}
                        {model.id === 'flux-image' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDemo(model)}
                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:scale-105 transform transition-all duration-300"
                          >
                            <Zap className="w-4 h-4 mr-2 animate-pulse" />
                            Try Demo
                          </Button>
                        )}

                        {/* Add to Bag/Launch Now Button */}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAddToBag(model)}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white ml-auto hover:scale-105 transform transition-all duration-300"
                        >
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {model.id === 'pytorch-server' ? (
                              <ShoppingBag className="w-4 h-4 mr-2" />
                            ) : (
                              <Rocket className="w-4 h-4 mr-2" />
                            )}
                          </motion.div>
                          {model.id === 'pytorch-server' ? 'Add to Bag' : 'Launch Now'}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ) : (
              // My Models view - show deployed containers
              deployedContainers.map((container) => (
                <motion.div
                  key={container.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="web3-card relative group p-6 bg-[#0A0A0A] border-gray-800 hover:border-blue-500/50 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                          <Box className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {container.model_name}
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              container.container_status === 'running'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {container.container_status}
                            </span>
                          </CardTitle>
                          <CardDescription>
                            Container: {container.container_address}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* GPU Info */}
                      {container.gpus?.map((gpu: any, index: number) => (
                        <motion.div 
                          key={gpu.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 * index }}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50"
                        >
                          <div className="flex items-center gap-3">
                            <Cpu className="w-5 h-5 text-blue-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-200">{gpu.gpu_type}</p>
                              <p className="text-xs text-gray-400">{gpu.gpuprice}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-200">
                              {gpu.memory_used} / {gpu.total_memory} MB
                            </p>
                            <p className="text-xs text-gray-400">
                              {gpu.mem_used_percent.toFixed(1)}% Used
                            </p>
                          </div>
                        </motion.div>
                      ))}

                      {/* Volume Info */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50"
                      >
                        <div className="flex items-center gap-3">
                          <HardDrive className="w-5 h-5 text-purple-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-200">Volume</p>
                            <p className="text-xs text-gray-400">{container.nas_server?.volume_server_identifier}</p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Uptime */}
                      <p className="text-sm text-gray-400">
                        Uptime: {container.system_uptime}
                      </p>

                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteModel(container)}
                        disabled={isDeleting === container.container_address}
                        className="w-full mt-4"
                      >
                        {isDeleting === container.container_address ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        {isDeleting === container.container_address ? 'Deleting...' : 'Delete Model'}
                      </Button>
                    </CardContent>

                    {/* URLs */}
                    {container.public_urls && (
                      <CardFooter className="pt-4 border-t border-gray-800">
                        <div className="w-full space-y-2">
                          <p className="text-sm font-medium text-gray-300">Access URLs:</p>
                          {container.public_urls.split(',').map((url: string, index: number) => (
                            <motion.a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 * index }}
                              className="block p-2 rounded bg-gray-900/50 text-sm text-blue-400 hover:text-blue-300 hover:bg-gray-900/70"
                            >
                              {url}
                            </motion.a>
                          ))}
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Search, Filter, Zap, Loader2, ShoppingBag, Star, Info, CheckCircle, Cpu, HardDrive, Box, ImageIcon, Video, Music, Bot, MessageSquare, Rocket, Trash2, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { models } from './options/models';
import { categoryToType } from './options/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { GPU, gpuData } from '@/constants/values';
import { GPULabClient } from '@/app/gpulab/gpulab-service';
import { useModelBag } from '@/store/model-bag';
import { CheckIcon } from '@/components/icons/CheckIcon';
import Image from 'next/image';
import ModelStatus from "@/app/gpulab/model-status";
import { useUser } from '@/lib/hooks/useUser';
import { ComingSoonOverlay } from '@/components/ComingSoonOverlay';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const DEV_EMAILS = ['nitishmeswal@gmail.com', 'neohex262@gmail.com', 'test@example.com', 'jprateek961@gmail.com'];

interface DeployedContainer {
  id: string;
  container_address: string;
  model_name: string;
  model_type: string;
  model_description: string;
  model_features: string[];
}

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
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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

  const [deployedContainers, setDeployedContainers] = useState<DeployedContainer[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { user } = useUser();
  const isDev = user?.email && DEV_EMAILS.includes(user.email);

  const [modelLikes, setModelLikes] = useState<Record<string, { count: number, isLiked: boolean }>>({});

  useEffect(() => {
    const initializeLikes = async () => {
      // Initialize with base count for all models
      const initialLikes: Record<string, { count: number, isLiked: boolean }> = {};
      models.forEach(model => {
        initialLikes[model.id] = {
          count: 7869,
          isLiked: false
        };
      });
      setModelLikes(initialLikes);

      if (!user) return;

      try {
        // Get all like counts
        const { data: likeCounts, error: likeError } = await supabase
          .from('model_like_counts')
          .select('model_id, like_count');

        if (likeError) throw likeError;

        // Get user's likes
        const { data: userLikes, error: userError } = await supabase
          .from('model_likes')
          .select('model_id')
          .eq('user_id', user.id);

        if (userError) throw userError;

        const userLikedModels = new Set(userLikes?.map(like => like.model_id) || []);

        // Update with actual counts and user likes
        likeCounts?.forEach(count => {
          if (initialLikes[count.model_id]) {
            initialLikes[count.model_id].count = count.like_count;
          }
        });

        userLikedModels.forEach(modelId => {
          if (initialLikes[modelId]) {
            initialLikes[modelId].isLiked = true;
          }
        });

        setModelLikes(initialLikes);
      } catch (error) {
        console.error('Error fetching likes:', error);
        toast.error('Failed to fetch likes');
      }
    };

    initializeLikes();
  }, [user, supabase]);

  const handleLike = async (modelId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    
    if (!user) {
      toast.error('Please sign in to like models');
      return;
    }

    try {
      const currentLike = modelLikes[modelId];
      if (!currentLike) return;

      if (currentLike.isLiked) {
        // Unlike
        const { error } = await supabase
          .from('model_likes')
          .delete()
          .eq('model_id', modelId)
          .eq('user_id', user.id);

        if (error) throw error;

        setModelLikes(prev => ({
          ...prev,
          [modelId]: {
            count: Math.max(7869, prev[modelId].count - 1),
            isLiked: false
          }
        }));
      } else {
        // Like
        const { error } = await supabase
          .from('model_likes')
          .insert({
            model_id: modelId,
            user_id: user.id
          });

        if (error) throw error;

        setModelLikes(prev => ({
          ...prev,
          [modelId]: {
            count: prev[modelId].count + 1,
            isLiked: true
          }
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleAddToBag = async (model: AIModel) => {
    try {
      // Special handling for specific models
      if (model.id === 'neurolov-image') {
        router.push('/neurolov-image');
        return;
      }
      
      if (model.id === 'music-ai') {
        router.push('/ai-models/music-ai');
        return;
      }

      if (model.id === 'uncensored-chat') {
        router.push('/ai-models/uncensored-chat');
        return;
      }

      if (model.id === 'text-to-3d') {
        router.push('/ai-models/text-to-3d');
        return;
      }

      if (model.id === 'video') {
        router.push('/ai-models/video');
        return;
      }

      if (model.id === 'deepfake') {
        router.push('/ai-models/deepfake');
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

  useEffect(() => {
    const fetchContainers = async () => {
      if (view === 'my-models') {
        try {
          const client = GPULabClient.getInstance();
          const containers = await client.getContainerList();
          setDeployedContainers(containers.map(container => ({...container, model_type: container.model_type || 'text'})));
        } catch (error) {
          console.error('Error fetching containers:', error);
        }
      }
    };

    fetchContainers();
    const interval = setInterval(fetchContainers, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [view]);

  const handleDeleteModel = async (container: DeployedContainer) => {
    try {
      setIsDeleting(container.container_address);
      const client = GPULabClient.getInstance();
      await client.deleteContainer(container.container_address);
      toast.success('Model deleted successfully');
      // Refresh the list
      const containers = await client.getContainerList();
      setDeployedContainers(containers.map(container => ({...container, model_type: container.model_type || 'text'})));
    } catch (error) {
      console.error('Error deleting model:', error);
      toast.error('Failed to delete model');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-black min-h-screen [font-family:var(--font-neue-haas)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {view === 'explore' ? (
          models.map((model) => (
            <Card 
              key={model.id} 
              className="relative overflow-hidden group bg-[#111111] border border-gray-800/50 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#00FF94]/30 hover:shadow-[0_0_20px_rgba(0,255,148,0.15)]"
            >
              {model.id !== 'neurolov-image' && !isDev && (
                <div className="absolute inset-0 z-50 backdrop-blur-md bg-black/50">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center p-4">
                      <h3 className="text-2xl font-bold text-[#0066FF] mb-2">
                        Coming Soon
                      </h3>
                      <p className="text-base text-gray-300">
                        This AI model will be available in the next version!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={`/ai-models/${model.id === 'neurolov-image' ? 'neuro-image-gen' : 
                        model.id === 'text-to-video' || model.id === 'video' ? 'ai-video' : 
                        model.id === 'music-ai' ? 'ai-music' : 
                        'neuro-image-gen'}.png`}
                  alt={model.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80">
                  <div className="absolute bottom-0 w-full p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-white text-[28px] font-medium tracking-[-0.02em] leading-none mb-1">{model.name}</h3>
                      <span className="text-gray-400 text-[15px] font-light">{model.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <p className="text-gray-400 text-[15px] leading-[1.4] max-w-[80%] font-light">
                    {model.description}
                  </p>
                  <div className="text-right">
                    <span className="text-[#00FF94] text-[32px] font-medium leading-none">95%</span>
                    <div className="text-gray-500 text-[13px] mt-1">Popularity</div>
                  </div>
                </div>
                
                <div className="space-y-[14px]">
                  {model.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-400 text-[15px] font-light">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 pb-6 flex items-center justify-between mt-2">
                <Button 
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-medium py-3 px-6 rounded-xl flex items-center gap-2 text-[15px]"
                  onClick={() => handleAddToBag(model)}
                  disabled={!isDev && model.id !== 'neurolov-image'}
                >
                  {isDev || model.id === 'neurolov-image' ? 'Launch App' : 'Coming Soon'} {model.id === 'neurolov-image' ? <ArrowRight className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
                </Button>
                <div 
                  className="flex items-center gap-2 text-gray-400 cursor-pointer group/like"
                  onClick={(e) => handleLike(model.id, e)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`hover:text-red-500 transition-colors ${modelLikes[model.id]?.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    <Heart className={`w-5 h-5 ${modelLikes[model.id]?.isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {modelLikes[model.id]?.count?.toLocaleString() || '7,869'}
                  </span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          deployedContainers.map((container) => (
            <Card 
              key={container.id} 
              className="relative overflow-hidden group bg-[#111111] border border-gray-800/50 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#00FF94]/30 hover:shadow-[0_0_20px_rgba(0,255,148,0.15)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={`/ai-models/${container.model_name === 'neurolov-image' ? 'neuro-image-gen' : 
                        container.model_name === 'text-to-video' || container.model_name === 'video' ? 'ai-video' : 
                        container.model_name === 'music-ai' ? 'ai-music' : 
                        'neuro-image-gen'}.png`}
                  alt={container.model_name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80">
                  <div className="absolute bottom-0 w-full p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-white text-[28px] font-medium tracking-[-0.02em] leading-none mb-1">{container.model_name}</h3>
                      <span className="text-gray-400 text-[15px] font-light">{container.model_type}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <p className="text-gray-400 text-[15px] leading-[1.4] max-w-[80%] font-light">
                    {container.model_description}
                  </p>
                  <div className="text-right">
                    <span className="text-[#00FF94] text-[32px] font-medium leading-none">95%</span>
                    <div className="text-gray-500 text-[13px] mt-1">Popularity</div>
                  </div>
                </div>
                
                <div className="space-y-[14px]">
                  {container.model_features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-400 text-[15px] font-light">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 pb-6 flex items-center justify-between mt-2">
                <Button 
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-medium py-3 px-6 rounded-xl flex items-center gap-2 text-[15px]"
                  onClick={() => handleDeleteModel(container)}
                  disabled={false}
                >
                  Delete Model <Trash2 className="w-5 h-5" />
                </Button>
                <div 
                  className="flex items-center gap-2 text-gray-400 cursor-pointer group/like"
                  onClick={(e) => handleLike(container.model_name, e)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`hover:text-red-500 transition-colors ${modelLikes[container.model_name]?.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    <Heart className={`w-5 h-5 ${modelLikes[container.model_name]?.isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {modelLikes[container.model_name]?.count?.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';
import { ImageIcon, Zap, Box, Video, Brain, MessageSquare, Music, Clock, Upload, Bot, AlertCircle, Compass, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { AIModel } from '@/services/types';
import { models } from './options/models';
import { categoryToType } from './options/constants';
import { GPULabClient } from '@/app/gpulab';
import { ComingSoonOverlay } from '@/components/ComingSoonOverlay';

const DEV_EMAILS = ['nitishmeswal@gmail.com', 'neohex262@gmail.com'];

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
  const MAX_GENERATIONS = 5;

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

  const generateImage = async (modelId: string) => {
    if (!prompt?.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (generationCount >= MAX_GENERATIONS) {
      setError("You've reached the maximum number of free generations. Please upgrade to continue.");
      return;
    }

    if (cooldownTime > 0) {
      setError(`Please wait ${cooldownTime} seconds before generating another image`);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/hyperbolic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() })
      });

      const data = await response.json();
      
      if (response.status === 429) {
        setError("Please wait 30 seconds between generations");
        setCooldownTime(30);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.images?.[0]) {
        setGeneratedImage(`data:image/png;base64,${data.images[0].image}`);
        setInferenceTime(data.inference_time);
        setGenerationCount(prev => prev + 1);
        setCooldownTime(30);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isGenerating) {
      e.preventDefault();
      generateImage('flux-image');
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
                    className={`text-sm ${view === 'explore' ? "bg-blue-500/20 text-blue-300" : "hover:bg-blue-500/10 text-blue-300/60 hover:text-blue-300"}`}
                  >
                    <Compass className="w-4 h-4 mr-2" />
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
            </div>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredModels.map((model) => (
              <div key={model.id} className="relative group">
                <Card className="relative bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${model.iconBg || 'bg-blue-500/10'}`}>
                        {React.createElement(model.icon, { className: 'w-5 h-5 text-blue-400' })}
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
                            onKeyDown={handleKeyPress}
                          />
                          <Button 
                            onClick={() => generateImage(model.id)}
                            disabled={isGenerating || generationCount >= MAX_GENERATIONS || cooldownTime > 0 || !prompt?.trim()}
                            className="w-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-300"
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : generationCount >= MAX_GENERATIONS ? (
                              <>
                                <Lock className="w-4 h-4 mr-2" />
                                Upgrade to Generate More
                              </>
                            ) : cooldownTime > 0 ? (
                              <>
                                <Clock className="w-4 h-4 mr-2" />
                                Wait {cooldownTime}s ({MAX_GENERATIONS - generationCount} left)
                              </>
                            ) : !prompt?.trim() ? (
                              <>
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Enter a Prompt
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 mr-2" />
                                Generate Image ({MAX_GENERATIONS - generationCount} left)
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
                                  onError={() => setError('Failed to load the generated image')}
                                />
                              </motion.div>
                              {inferenceTime && (
                                <p className="text-sm text-gray-400 mt-2">
                                  Generated in {inferenceTime.toFixed(2)}s
                                </p>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-4">
                    {!user?.email || !DEV_EMAILS.includes(user.email) ? (
                      <ComingSoonOverlay 
                        type="toast" 
                        title="Deploy Model"
                        description="AI Model deployment will be available soon!"
                      />
                    ) : (
                      <Button
                        onClick={async () => {
                          try {
                            console.log('Starting model deployment...');
                            const result = await GPULabClient.getInstance().deployModel();
                            
                            console.log('Deployment result:', result);
                            toast.success('Model Deployment Started!', {
                              description: `Model ID: ${result.model_id}`,
                            });

                            router.push(`/ai-models/${model.id}`);
                          } catch (error: any) {
                            console.error('Full deployment error:', error);
                            toast.error('Deployment Failed', {
                              description: error.message || 'An error occurred during deployment'
                            });
                          }
                        }}
                        disabled={false}
                        className="w-full"
                      >
                        Deploy Model
                      </Button>
                    )}
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

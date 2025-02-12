'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageIcon, Sparkles, Send, Download, Wand2, Image as ImageLucide, PenTool, Layers, Palette, CircleSlash2, Combine, Settings2, LayoutTemplate, Zap, Crown, Frame, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './neuroStyle.css';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'image';
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

interface ImageConfig {
  style: 'Realistic' | 'Anime' | 'Digital Art';
  quality: 'Fast' | 'Standard' | 'Ultra HD';
  ratio: '1:1' | '16:9' | '9:16';
  enhancement: 'Standard' | 'Ultra HD';
}

interface FeatureState {
  type: string;
  count: number;
}

const examplePrompts = [
  "Create a photorealistic portrait in renaissance style",
  "Create an anime-style character with vibrant colors",
  "Generate a surreal dreamscape with floating islands",
  "Design a minimalist abstract composition",
  "Remove background and create transparent PNG",
  "Combine multiple styles into one unique image"
];

const featureOptions = [
  { 
    type: 'quality', 
    icon: '✨', 
    prompt: 'in ultra HD quality, highly detailed, sharp and clear', 
    color: '#FF6B6B' 
  },
  { 
    type: 'lighting', 
    icon: '💡', 
    prompt: 'with perfect lighting, enhanced shadows and highlights', 
    color: '#4ECDC4' 
  },
  { 
    type: 'detail', 
    icon: '🔍', 
    prompt: 'with intricate details, fine textures, and precise features', 
    color: '#45B7D1' 
  },
  { 
    type: 'enhance', 
    icon: '⚡', 
    prompt: 'enhanced with more definition and clarity', 
    color: '#96CEB4' 
  },
  { 
    type: 'focus', 
    icon: '🎯', 
    prompt: 'with perfect focus and depth of field', 
    color: '#FFEEAD' 
  },
  { 
    type: 'resolution', 
    icon: '💫', 
    prompt: 'in 8k resolution with maximum sharpness', 
    color: '#D4A5A5' 
  }
];

export default function NeuroImageGenerator() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('neurolov-image-history');
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          return parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        } catch (e) {
          console.error('Error parsing saved messages:', e);
          return [];
        }
      }
    }
    return [];
  });

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [config, setConfig] = useState<ImageConfig>({
    style: 'Realistic',
    quality: 'Standard',
    ratio: '1:1',
    enhancement: 'Standard'
  });

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFeature, setDraggedFeature] = useState<string | null>(null);
  const [isClusterOpen, setIsClusterOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleFeatureDragStart = (type: string) => {
    setIsDragging(true);
    setDraggedFeature(type);
  };

  const handleFeatureDragEnd = () => {
    setIsDragging(false);
    setDraggedFeature(null);
  };

  const handleFeatureDrop = (e: React.DragEvent, targetMessage: Message) => {
    e.preventDefault();
    if (!draggedFeature || targetMessage.type !== 'image') return;

    const feature = featureOptions.find(f => f.type === draggedFeature);
    if (!feature) return;

    setSelectedFeatures(prev => [...prev, draggedFeature]);
    
    // Update prompt with feature while keeping original subject
    setPrompt(prev => {
      const basePrompt = targetMessage.content;
      const featurePrompt = feature.prompt;
      return `${basePrompt} ${featurePrompt}`;
    });

    // Visual feedback
    const ball = document.createElement('div');
    ball.className = 'feature-ball-effect';
    ball.style.left = `${e.clientX}px`;
    ball.style.top = `${e.clientY}px`;
    ball.style.backgroundColor = feature.color;
    document.body.appendChild(ball);

    setTimeout(() => document.body.removeChild(ball), 1000);
  };

  const removeFeature = (typeToRemove: string) => {
    setSelectedFeatures(prev => prev.filter(type => type !== typeToRemove));
    
    // Update prompt by removing the feature's prompt
    const feature = featureOptions.find(f => f.type === typeToRemove);
    if (feature) {
      setPrompt(prev => prev.replace(feature.prompt, '').trim());
    }
  };

  const safelyStoreMessages = (messagesToStore: Message[]) => {
    try {
      // Keep only the last 50 messages to prevent storage issues
      const limitedMessages = messagesToStore.slice(-50);
      const serializedData = JSON.stringify(limitedMessages);
      
      // Check if size is too large (5MB limit)
      if (serializedData.length > 5 * 1024 * 1024) {
        // If still too large, keep removing messages until it fits
        while (serializedData.length > 5 * 1024 * 1024 && limitedMessages.length > 0) {
          limitedMessages.shift(); // Remove oldest message
        }
      }
      
      localStorage.setItem('neurolov-image-history', JSON.stringify(limitedMessages));
      return true;
    } catch (error) {
      console.error('Error storing messages:', error);
      
      // If storage failed, try clearing old data
      try {
        localStorage.clear();
        const essential = messagesToStore.slice(-10); // Keep only last 10 messages
        localStorage.setItem('neurolov-image-history', JSON.stringify(essential));
        toast.warning('Message history was trimmed due to storage limits', {
          style: { background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)' }
        });
        return true;
      } catch (e) {
        console.error('Failed to store even after cleanup:', e);
        toast.error('Unable to save message history', {
          style: { background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)' }
        });
        return false;
      }
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      safelyStoreMessages(messages);
      setShowWelcome(false);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePromptSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    setShowWelcome(false);
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('neurolov-image-history');
    toast.success('History cleared successfully!');
  };

  const updateConfig = (key: keyof ImageConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    
    // Update the prompt based on config
    let enhancedPrompt = prompt;
    if (key === 'style') {
      enhancedPrompt = `${value.toLowerCase()} style: ${prompt}`;
    }
    if (key === 'enhancement' && value === 'Ultra HD') {
      enhancedPrompt += ', 8k uhd, highly detailed';
    }
    setPrompt(enhancedPrompt);
  };

  const getConfigIcon = (option: string) => {
    switch (option) {
      case 'Realistic': return <ImageIcon />;
      case 'Anime': return <PenTool />;
      case 'Digital Art': return <Palette />;
      case 'Ultra HD': return <Crown />;
      case 'Standard': return <Zap />;
      case 'Fast': return <Sparkles />;
      case '1:1': return <Frame />;
      case '16:9': return <Maximize2 />;
      case '9:16': return <Minimize2 />;
      default: return <Settings2 />;
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    setIsGenerating(true);
    setPrompt('');

    try {
      console.log('Sending request with prompt:', prompt);
      
      // Get dimensions based on ratio
      let width = 1024, height = 1024;
      if (config.ratio === '16:9') {
        width = 1024;
        height = 576;
      } else if (config.ratio === '9:16') {
        width = 576;
        height = 1024;
      }

      const response = await fetch('/api/Neurolov-image-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          width,
          height,
          num_samples: 1,
          enhance_prompt: config.enhancement === 'Ultra HD',
          quality: config.quality === 'Ultra HD' ? 'high' : config.quality === 'Fast' ? 'fast' : 'standard',
          negative_prompt: 'blurry, low quality, distorted, deformed'
        })
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      if (!data.images?.[0]) {
        console.error('Invalid response structure:', data);
        throw new Error('No image URL in response');
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'image',
        content: prompt,
        imageUrl: data.images[0],
        timestamp: new Date()
      };
      
      console.log('Adding new message with image:', assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Image generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `neurolovaigen-${timestamp}.png`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success('Image downloaded successfully', {
        style: { background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)' }
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  return (
    <div className="neuro-container">
      <div className="neuro-background">
        <div className="neuro-grid"></div>
        <div className="neuro-glow"></div>
      </div>
      
      <div className="neuro-content">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Neuro Image Gen
        </motion.h1>

        {/* Chat Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 max-w-7xl mx-auto">
          <div className="glass-panel h-[calc(100vh-300px)] overflow-y-auto">
            <div className="space-y-6 p-6">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div 
                    className={`max-w-[80%] ${
                      message.type === 'user' ? 'message-user' :
                      message.type === 'image' ? 'message-image' :
                      'message-assistant'
                    }`}
                    onDragOver={(e) => message.type === 'image' && e.preventDefault()}
                    onDrop={(e) => handleFeatureDrop(e, message)}
                  >
                    {message.type === 'image' && message.imageUrl ? (
                      <div className="relative w-full aspect-square">
                        <Image
                          src={message.imageUrl}
                          alt={message.content}
                          fill
                          className="object-cover rounded-xl"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-end p-4">
                          <div className="w-full flex justify-between items-center">
                            <p className="text-sm text-white/90 line-clamp-2">{message.content}</p>
                            <Button
                              onClick={() => window.open(message.imageUrl, '_blank')}
                              size="icon"
                              variant="ghost"
                              className="ml-2"
                            >
                              <Download className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-white">{message.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {messages.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center mt-8"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 clear-history-btn"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Chat History
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Control Panel */}
          <div className="glass-panel p-6">
            <div className="space-y-4">
              {selectedFeatures.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedFeatures.map((type) => {
                    const feature = featureOptions.find(f => f.type === type);
                    return feature && (
                      <div 
                        key={type}
                        className="feature-tag"
                        style={{ backgroundColor: feature.color }}
                      >
                        <span>{feature.icon}</span>
                        <span>{feature.type}</span>
                        <button 
                          className="remove-feature"
                          onClick={() => removeFeature(type)}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your imagination..."
                className="prompt-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />

              <div className="flex items-center gap-4">
                <div className="relative">
                  <motion.div
                    className="feature-cluster"
                    onClick={() => setIsClusterOpen(!isClusterOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl">✨</span>
                    <motion.span
                      className="cluster-arrow"
                      animate={{ rotate: isClusterOpen ? 180 : 0 }}
                    >
                      ▼
                    </motion.span>
                  </motion.div>

                  <AnimatePresence>
                    {isClusterOpen && !isGenerating && (
                      <motion.div 
                        className="feature-balls-container"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        {featureOptions.map((feature) => (
                          <motion.div
                            key={feature.type}
                            className="feature-ball"
                            style={{ backgroundColor: feature.color }}
                            draggable
                            onDragStart={() => handleFeatureDragStart(feature.type)}
                            onDragEnd={handleFeatureDragEnd}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>{feature.icon}</span>
                            <span className="feature-tooltip">
                              <strong>{feature.type}</strong>
                              <br />
                              {feature.prompt}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="generate-button ml-auto"
                >
                  {isGenerating ? (
                    <>
                      <div className="loading-spinner" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

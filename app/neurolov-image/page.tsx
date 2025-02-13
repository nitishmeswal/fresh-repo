'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Image, Palette, LayoutTemplate, Wand2, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from '@/lib/hooks/useUser';
import './neuroStyle.css';

interface ChatMessage {
  type: 'prompt' | 'response';
  content: string;
  image?: string;
  metadata?: {
    size?: string;
    style?: string;
    enhance?: boolean;
  };
}

export default function NeuroImageGenerator() {
  const router = useRouter();
  const { user } = useUser();
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSize, setSelectedSize] = useState('1024x1024');
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [enhance, setEnhance] = useState(true);
  const [showSizeDialog, setShowSizeDialog] = useState(false);
  const [showStyleDialog, setShowStyleDialog] = useState(false);
  const [showAspectRatioDialog, setShowAspectRatioDialog] = useState(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('square');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user) {
      // Use full_name from user metadata if available, otherwise use email
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Guest';
      setUserName(name);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const savedHistory = localStorage.getItem(`image_gen_history_${user.id}`);
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && chatHistory.length > 0) {
      localStorage.setItem(`image_gen_history_${user.id}`, JSON.stringify(chatHistory));
    }
  }, [chatHistory, user]);

  const handleBack = () => {
    router.push('/ai-models');
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    const promptMessage: ChatMessage = {
      type: 'prompt',
      content: prompt
    };
    setChatHistory(prev => [...prev, promptMessage]);

    try {
      const [width, height] = selectedSize.split('x').map(Number);
      
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
          enhance_prompt: enhance,
          art_style: selectedStyle,
          negative_prompt: 'blurry, low quality, distorted, deformed'
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate image');
      if (data.images?.[0]) {
        const responseMessage: ChatMessage = {
          type: 'response',
          content: prompt,
          image: data.images[0],
          metadata: {
            size: selectedSize,
            style: selectedStyle,
            enhance
          }
        };
        setChatHistory(prev => [...prev, responseMessage]);
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  const handleDownload = (image: string) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearHistory = () => {
    if (user) {
      localStorage.removeItem(`image_gen_history_${user.id}`);
      setChatHistory([]);
    }
  };

  return (
    <>
      {/* Main content area */}
      <div className="main-content">
        <div className="sticky-header compact-header">
          <button className="back-button" onClick={() => router.push('/ai-models')}>
            <ArrowLeft className="icon" />
            All AI Models
          </button>
        </div>

        <div className="image-gen">
          <div className="header-row">
            <div className="welcome-header">
              <h2 className="greeting">Hi there, <span className="name">{userName}</span></h2>
              <h1>What would you like to imagine today?</h1>
            </div>
            <button className="clear-history" onClick={handleClearHistory}>
              <Trash2 className="icon" />
              Clear History
            </button>
          </div>

          <p className="description">
            Enter your text prompt here. Be as descriptive as possible! (e.g., A photorealistic image of a majestic lion resting on a grassy savanna at sunset, with golden light filtering through the clouds.
          </p>

          {/* Generated images will appear here */}
          <div className="generated-images">
            {chatHistory.map((message, index) => (
              message.type === 'response' && message.image && (
                <div key={index} className="image-card">
                  <img src={message.image} alt={message.content} />
                  <div className="image-overlay">
                    <button className="download-button" onClick={() => handleDownload(message.image!)}>
                      <Download className="icon" />
                    </button>
                    <div className="image-metadata">
                      {selectedSize && <span className="metadata-tag">{selectedSize}</span>}
                      {selectedStyle && <span className="metadata-tag">{selectedStyle}</span>}
                      {selectedAspectRatio && <span className="metadata-tag">{selectedAspectRatio}</span>}
                      {enhance && <span className="metadata-tag enhance">Enhanced</span>}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Fixed prompt dialog at bottom */}
      <div className="prompt-dialog">
        <div className="prompt-area">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a detailed description of what you want to create... (e.g., A serene scene with two transparent glass chairs in shallow water...)"
            className={`prompt-input ${prompt ? 'has-content' : ''}`}
          />
          
          <div className="controls">
            <div className="control-buttons">
              <button 
                className={`control-button ${selectedSize ? 'active' : ''}`}
                onClick={() => setShowSizeDialog(true)}
              >
                <Image className="icon" />
                {selectedSize || 'Image Size/Resolution'}
              </button>
              <button 
                className={`control-button ${selectedStyle ? 'active' : ''}`}
                onClick={() => setShowStyleDialog(true)}
              >
                <Palette className="icon" />
                {selectedStyle || 'Art Style'}
              </button>
              <button 
                className={`control-button ${selectedAspectRatio ? 'active' : ''}`}
                onClick={() => setShowAspectRatioDialog(true)}
              >
                <LayoutTemplate className="icon" />
                {selectedAspectRatio || 'Aspect Ratio'}
              </button>
              <button 
                className={`control-button ${enhance ? 'active' : ''}`}
                onClick={() => setEnhance(!enhance)}
              >
                <Wand2 className="icon" />
                Enhance
              </button>
            </div>

            <button 
              className="generate-button"
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="icon animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="icon" />
                  Generate →
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showSizeDialog} onOpenChange={setShowSizeDialog}>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle>Select Image Size</DialogTitle>
          </DialogHeader>
          <div className="dialog-options">
            {[
              { label: '512x512', value: '512x512' },
              { label: '768x768', value: '768x768' },
              { label: '1024x1024', value: '1024x1024' },
              { label: '1024x768 (Landscape)', value: '1024x768' },
              { label: '768x1024 (Portrait)', value: '768x1024' },
            ].map((size) => (
              <Button
                key={size.value}
                variant="ghost"
                className={`option ${selectedSize === size.value ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedSize(size.value);
                  setShowSizeDialog(false);
                }}
              >
                {size.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showStyleDialog} onOpenChange={setShowStyleDialog}>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle>Select Art Style</DialogTitle>
          </DialogHeader>
          <div className="dialog-options">
            {[
              { label: 'Photorealistic', value: 'photorealistic' },
              { label: 'Digital Art', value: 'digital-art' },
              { label: 'Anime', value: 'anime' },
              { label: 'Oil Painting', value: 'oil-painting' },
              { label: 'Watercolor', value: 'watercolor' },
              { label: 'Pencil Sketch', value: 'pencil-sketch' },
            ].map((style) => (
              <Button
                key={style.value}
                variant="ghost"
                className={`option ${selectedStyle === style.value ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedStyle(style.value);
                  setShowStyleDialog(false);
                }}
              >
                {style.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAspectRatioDialog} onOpenChange={setShowAspectRatioDialog}>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle>Select Aspect Ratio</DialogTitle>
          </DialogHeader>
          <div className="dialog-options">
            {[
              { label: 'Square (1:1)', value: 'square' },
              { label: 'Landscape (16:9)', value: 'landscape' },
              { label: 'Portrait (9:16)', value: 'portrait' },
              { label: 'Wide (2:1)', value: 'wide' },
              { label: 'Tall (1:2)', value: 'tall' },
            ].map((ratio) => (
              <Button
                key={ratio.value}
                variant="ghost"
                className={`option ${selectedAspectRatio === ratio.value ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedAspectRatio(ratio.value);
                  setShowAspectRatioDialog(false);
                }}
              >
                {ratio.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

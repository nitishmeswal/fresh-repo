'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Image, Palette, LayoutTemplate, Wand2, Loader2, Sparkles } from 'lucide-react';
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

  return (
    <div className="chat-ui">
      <div className="header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft className="icon" />
          All AI Models
        </button>
      </div>

      <div className="content">
        <div className="welcome">
          <h1 className="welcome-title">
            Hi there, <span className="welcome-name">{userName}</span>
          </h1>
          <h2 className="welcome-subtitle">What would you like to imagine today?</h2>
          <p className="welcome-description">
            Enter your text prompt here. Be as descriptive as possible! (e.g., A photorealistic image of a majestic lion resting on a grassy savanna at sunset, with golden light filtering through the clouds.
          </p>

          {chatHistory.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              <div className={`message-content ${message.type}`}>
                {message.content}
                {message.type === 'response' && message.image && (
                  <div className="message-image-container">
                    <img src={message.image} alt={message.content} />
                    <button className="download-button" onClick={() => handleDownload(message.image!)}>
                      <Download className="icon" />
                    </button>
                    {message.metadata && (
                      <div className="message-metadata">
                        <span className="metadata-tag">{message.metadata.size}</span>
                        <span className="metadata-tag">{message.metadata.style}</span>
                        {message.metadata.enhance && (
                          <span className="metadata-tag enhance">Enhanced</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="prompt-dialog">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="In a serene depiction, two transparent chairs crafted from intricately shattered glass are elegantly positioned in shallow, crystal-clear water..."
              rows={3}
            />
            <div className="controls">
              <button className="control-button" onClick={() => setShowSizeDialog(true)}>
                <Image className="icon" />
                <span>512x512</span>
              </button>
              <button className="control-button" onClick={() => setShowStyleDialog(true)}>
                <Palette className="icon" />
                <span>Art Style</span>
              </button>
              <button className="control-button" onClick={() => setShowAspectRatioDialog(true)}>
                <LayoutTemplate className="icon" />
                <span>Aspect Ratio</span>
              </button>
              <button className={`control-button ${enhance ? 'enhance active' : ''}`} onClick={() => setEnhance(!enhance)}>
                <Wand2 className="icon" />
                <span>Enhance</span>
              </button>
              <button
                className="generate-button"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="icon animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="icon" />
                    <span>Generate →</span>
                  </>
                )}
              </button>
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
        </div>
      </div>
    </div>
  );
}

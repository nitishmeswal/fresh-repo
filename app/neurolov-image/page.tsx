'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Image, Palette, LayoutTemplate, Wand2, Loader2, Sparkles, Trash2, X, ArrowDown, Settings } from 'lucide-react';
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
  const [userName, setUserName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

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

    // Create enhanced prompt with metadata
    const enhancedPrompt = `${prompt}\n\nSettings:\n- Size: ${selectedSize}\n- Style: ${selectedStyle}\n${enhance ? '- Enhanced: Yes' : ''}`;

    const promptMessage: ChatMessage = {
      type: 'prompt',
      content: enhancedPrompt
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
          content: enhancedPrompt,
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
      
      // Add error message to chat history
      const errorMessage: ChatMessage = {
        type: 'response',
        content: 'Failed to generate image. The system will automatically try alternative services.',
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  const handleDownload = (image: string) => {
    // Convert base64 to blob
    fetch(image)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // Remove any query parameters or extra path segments from the image URL
        const fileName = `neurolov-image-${Date.now()}.png`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => console.error('Error downloading image:', error));
  };

  const handleClearHistory = () => {
    if (user) {
      localStorage.removeItem(`image_gen_history_${user.id}`);
      setChatHistory([]);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const sizeOptions = [
    '512x512',
    '1024x1024'
  ];

  const styleOptions = [
    'photorealistic',
    'painting',
    'cartoon',
    'abstract',
    'anime'
  ];

  return (
    <>
      {/* Main content area */}
      <div className="main-content" style={{ left: 0 }}>
        <div className="sticky-header compact-header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft className="icon" />
            All AI Models
          </button>
        </div>

        <div className="image-gen" style={{ maxWidth: '1200px' }}>
          <div className="header-row">
            <div className="welcome-header">
              <h2 className="greeting">Hi there, <span className="name">{userName}</span> what would you like to imageine today?</h2>
            </div>
          </div>

          {/* Chat messages and generated images */}
          <div className="generated-images">
            {chatHistory.map((message, index) => (
              <div key={index} className={`chat-message ${message.type}`}>
                <div className="message-content">
                  {message.type === 'prompt' ? (
                    <p>{message.content}</p>
                  ) : message.image && (
                    <div className="image-card">
                      <img src={message.image} alt={message.content} onClick={() => handleImageClick(message.image!)} />
                      <div className="image-overlay">
                        <div className="image-metadata">
                          {message.metadata?.size && <span className="metadata-tag">{message.metadata.size}</span>}
                          {message.metadata?.style && <span className="metadata-tag">{message.metadata.style}</span>}
                          {message.metadata?.enhance && <span className="metadata-tag enhance">Enhanced</span>}
                        </div>
                      </div>
                      <Button
                        className="download-button"
                        style={{ marginTop: '20px'}}
                        onClick={() => handleDownload(message.image!)}
                        aria-label="Download image"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>
              <X className="icon" />
            </button>
            <img src={selectedImage} alt="Generated" />
          </div>
        </div>
      )}

      {/* Prompt dialog */}
      <div className="prompt-dialog" style={{ left: 0 }}>
        <div className="prompt-input">
          <textarea
            placeholder="Enter a detailed description of what you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
          <div className="feature-buttons">
          <button className="clear-history" onClick={handleClearHistory}>
              <Trash2 className="icon" />
              Clear History
            </button>
            
            <button 
              className="feature-button"
              onClick={() => setShowSettingsDialog(true)}
            >
              <Settings className="icon" />
              Settings
            </button>

            <button
              className="generate-button"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="icon animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="icon" />
                  Generate →
                </>
              )}
            </button>
          </div>

          {/* Settings Dialog */}
          <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
            <DialogContent className="dialog-content">
              <DialogHeader>
                <DialogTitle>Image Settings</DialogTitle>
              </DialogHeader>
              <div className="settings-options">
                <button 
                  className="feature-button"
                  onClick={() => {
                    setShowSizeDialog(true);
                    setShowSettingsDialog(false);
                  }}
                >
                  <Image className="icon" />
                  Image Size
                </button>

                <button 
                  className="feature-button"
                  onClick={() => {
                    setShowStyleDialog(true);
                    setShowSettingsDialog(false);
                  }}
                >
                  <Palette className="icon" />
                  Style
                </button>

                <button 
                  className={`feature-button ${enhance ? 'active' : ''}`}
                  onClick={() => {
                    setEnhance(!enhance);
                    setShowSettingsDialog(false);
                  }}
                >
                  <Sparkles className="icon" />
                  Enhance
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Other Dialogs */}
          <Dialog open={showSizeDialog} onOpenChange={setShowSizeDialog}>
            <DialogContent className="dialog-content">
              <DialogHeader>
                <DialogTitle>Select Image Size</DialogTitle>
              </DialogHeader>
              <div className="dialog-options">
                {sizeOptions.map((size) => (
                  <Button
                    key={size}
                    variant="ghost"
                    className={`option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedSize(size);
                      setShowSizeDialog(false);
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showStyleDialog} onOpenChange={setShowStyleDialog}>
            <DialogContent className="dialog-content">
              <DialogHeader>
                <DialogTitle>Select Style</DialogTitle>
              </DialogHeader>
              <div className="dialog-options">
                {styleOptions.map((style) => (
                  <Button
                    key={style}
                    variant="ghost"
                    className={`option ${selectedStyle === style ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedStyle(style);
                      setShowStyleDialog(false);
                    }}
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}

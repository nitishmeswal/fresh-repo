'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Image, Palette, Wand2, Loader2, Sparkles, Trash2, X, Settings, Share2, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from '@/app/auth/useUser';
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
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [userName, setUserName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // For per-image share overlay (stores index of image whose share overlay is open)
  const [activeShareIndex, setActiveShareIndex] = useState<number | null>(null);

  // Filter out logs containing API endpoint details in production
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      const originalLog = console.log;
      console.log = (...args: any[]) => {
        if (args.some(arg => typeof arg === 'string' && arg.includes('/api/Neurolov-image-generator'))) {
          return;
        }
        originalLog(...args);
      };
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Guest';
      setUserName(name);
    }
  }, [user]);

  React.useEffect(() => {
    if (user) {
      const savedHistory = localStorage.getItem(`image_gen_history_${user.id}`);
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      }
    }
  }, [user]);

  React.useEffect(() => {
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

    // Show progress dialog and reset progress.
    setShowProgressDialog(true);
    setGenerationProgress(0);

    // Start a simulated progress update interval with smaller increments for smoothness.
    const intervalId = setInterval(() => {
      setGenerationProgress(prev => (prev < 90 ? prev + 3 : prev));
    }, 100);

    // Create enhanced prompt with metadata for API call only.
    const enhancedPrompt = `${prompt}\n\nSettings:\n- Size: ${selectedSize}\n- Style: ${selectedStyle}\n${enhance ? '- Enhanced: Yes' : ''}`;

    // Store only the raw prompt in the chat history.
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
      setGenerationProgress(100);
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage: ChatMessage = {
        type: 'response',
        content: 'Failed to generate image. The system will automatically try alternative services.',
      };
      setChatHistory(prev => [...prev, errorMessage]);
      setGenerationProgress(100);
    } finally {
      clearInterval(intervalId);
      setIsGenerating(false);
      setPrompt('');
      setTimeout(() => {
        setShowProgressDialog(false);
        setGenerationProgress(0);
      }, 500);
    }
  };

  const handleDownload = (image: string) => {
    fetch(image)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
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

  const handleShare = async (imageUrl: string) => {
    try {
      // Download the image first
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const fileName = `neurolov-image-${Date.now()}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Try native sharing first
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Check out this image!',
          text: 'Generated with Neurolov'
        });
      } else {
        // Fallback to custom share dialog
        const shareWindow = document.createElement('div');
        shareWindow.style.position = 'fixed';
        shareWindow.style.top = '50%';
        shareWindow.style.left = '50%';
        shareWindow.style.transform = 'translate(-50%, -50%)';
        shareWindow.style.backgroundColor = 'white';
        shareWindow.style.padding = '20px';
        shareWindow.style.borderRadius = '10px';
        shareWindow.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        shareWindow.style.zIndex = '1000';
        shareWindow.style.display = 'flex';
        shareWindow.style.flexDirection = 'column';
        shareWindow.style.gap = '10px';
        shareWindow.style.minWidth = '200px';

        const platforms = [
          { name: 'Twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this image generated with Neurolov!')}` },
          { name: 'Telegram', url: `https://t.me/share/url?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent('Check out this image generated with Neurolov!')}` },
          { name: 'Instagram', url: 'https://www.instagram.com' }
        ];

        platforms.forEach(platform => {
          const button = document.createElement('button');
          button.textContent = `Share on ${platform.name}`;
          button.style.padding = '10px';
          button.style.border = 'none';
          button.style.borderRadius = '5px';
          button.style.backgroundColor = '#0070f3';
          button.style.color = 'white';
          button.style.cursor = 'pointer';
          button.style.width = '100%';
          button.style.fontSize = '14px';
          button.style.display = 'flex';
          button.style.alignItems = 'center';
          button.style.justifyContent = 'center';
          button.style.gap = '8px';

          button.onmouseover = () => {
            button.style.backgroundColor = '#0051cc';
          };
          button.onmouseout = () => {
            button.style.backgroundColor = '#0070f3';
          };

          button.onclick = async () => {
            if (platform.name === 'Instagram') {
              // For Instagram, we need to download the image first
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = fileName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(a.href);
              setTimeout(() => {
                window.open(platform.url, '_blank');
              }, 100);
            } else {
              window.open(platform.url, '_blank');
            }
            document.body.removeChild(shareWindow);
          };

          shareWindow.appendChild(button);
        });

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.padding = '10px';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.backgroundColor = '#ff4444';
        closeButton.style.color = 'white';
        closeButton.style.cursor = 'pointer';
        closeButton.style.width = '100%';
        closeButton.style.marginTop = '10px';
        closeButton.onclick = () => document.body.removeChild(shareWindow);

        shareWindow.appendChild(closeButton);
        document.body.appendChild(shareWindow);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share the image. Please try again.');
    }
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
              <h2 className="greeting">
                Hi there, <span className="name">{userName}</span> what would you like to imagine today?
              </h2>
            </div>
          </div>

          {/* Chat messages and generated images */}
          <div className="generated-images">
            {chatHistory.map((message, index) => (
              <div key={index} className={`chat-message ${message.type}`}>
                {message.type === 'prompt' ? (
                  <div className="message-content">
                    <p>{message.content}</p>
                  </div>
                ) : (
                  <div className="image-container">
                    {message.image && (
                      <div className="image-card">
                        <img
                          src={message.image}
                          alt={message.content}
                          onClick={() => handleImageClick(message.image!)}
                        />
                        <div className="image-actions" style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          display: 'flex',
                          gap: '8px',
                          zIndex: 10
                        }}>
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => handleShare(message.image!)}
                            style={{
                              background: 'white',
                              borderRadius: '50%',
                              padding: '6px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => handleDownload(message.image!)}
                            style={{
                              background: 'white',
                              borderRadius: '50%',
                              padding: '6px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        {/* Generation features metadata */}
                        <div className="image-metadata" style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}>
                          {message.metadata?.size && (
                            <span style={{
                              background: 'rgba(255,255,255,0.9)',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Image className="h-3 w-3" />
                              {message.metadata.size}
                            </span>
                          )}
                          {message.metadata?.style && (
                            <span style={{
                              background: 'rgba(255,255,255,0.9)',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Palette className="h-3 w-3" />
                              {message.metadata.style}
                            </span>
                          )}
                          {message.metadata?.enhance && (
                            <span style={{
                              background: 'rgba(var(--primary-rgb), 0.9)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Wand2 className="h-3 w-3" />
                              Enhanced
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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

      {/* Prompt and Settings Dialogs */}
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
            <button 
              className="feature-button"
              onClick={handleClearHistory}
            >
              <Trash2 className="icon" />
            </button>
            
            <button 
              className="feature-button"
              onClick={() => setShowSettingsDialog(true)}
            >
              <Settings className="icon" />
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

          {/* Image Size Dialog */}
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

          {/* Style Dialog */}
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
      {/* Progress Dialog */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle>Image Generation Progress</DialogTitle>
          </DialogHeader>
          <div className="progress-content">
            <p>Generating image... {generationProgress}% completed</p>
            <div
              className="progress-bar"
              style={{
                backgroundColor: '#e0e0e0',
                height: '10px',
                borderRadius: '5px',
                overflow: 'hidden',
                marginTop: '10px'
              }}
            >
              <div
                className="progress"
                style={{
                  width: `${generationProgress}%`,
                  backgroundColor: '#3b82f6',
                  height: '100%',
                  transition: 'width 0.5s ease-in-out'
                }}
              ></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

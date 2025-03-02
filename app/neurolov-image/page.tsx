'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Image, Palette, LayoutTemplate, Wand2, Loader2, Sparkles, Trash2, X, ArrowDown, Settings, Share2 } from 'lucide-react';
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

interface SamplePrompt {
  display: string;
  detailed: string;
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
  const [generationCount, setGenerationCount] = useState(0);
  const [isPromptSectionCollapsed, setIsPromptSectionCollapsed] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const samplePrompts: SamplePrompt[] = [
    {
      display: "Moonlit wolf with glowing eyes",
      detailed: "A majestic wolf stands on a rocky cliff under a luminous full moon, its fur silvery and eyes glowing with an otherworldly light."
    },
    {
      display: "AI-powered assassin dodging laser bullets",
      detailed: "A sleek, cybernetic assassin in motion, their body twisting impossibly as they dodge streams of neon laser fire. Their suit is a mix of matte black armor and glowing circuit patterns."
    },
    {
      display: "Cyberpunk street market",
      detailed: "A bustling night market in a cyberpunk city. Neon signs illuminate narrow streets, with holographic ads floating above vendor stalls."
    },
    {
      display: "Crystal garden in fantasy realm",
      detailed: "A magical garden where crystals grow instead of plants, emitting soft multicolored light. Crystalline butterflies flutter between formations."
    },
    {
      display: "Steampunk airship battle",
      detailed: "Two massive steampunk airships engaged in battle among the clouds, brass and copper machinery gleaming, steam billowing from pipes."
    },
    {
      display: "Ancient tree of wisdom",
      detailed: "An enormous ancient tree with a face in its bark, branches reaching skyward like arms, roots glowing with magical energy."
    },
    {
      display: "Underwater city of Atlantis",
      detailed: "A majestic underwater city with classical Greek architecture, schools of fish swimming between buildings lit by bioluminescent plants."
    },
    {
      display: "Desert nomad and sand dragon",
      detailed: "A mysterious nomad riding a massive dragon made of living sand, its eyes glowing like golden sunlight."
    },
    {
      display: "Space station garden",
      detailed: "A lush hydroponics garden inside a futuristic space station, plants growing in geometric patterns with Earth visible through windows."
    },
    {
      display: "Clockwork butterfly",
      detailed: "A delicate mechanical butterfly with intricate gears and crystal wings that catch and reflect light in rainbow patterns."
    },
    {
      display: "Northern lights village",
      detailed: "A cozy Nordic village under spectacular aurora borealis, snow-covered cottages with warm lights in windows."
    },
    {
      display: "Quantum computer core",
      detailed: "The core of a quantum computer visualized as a complex crystalline structure with data streams flowing through it."
    },
    {
      display: "Fairy tale book shop",
      detailed: "An enchanted bookshop where stories come alive, books floating through air and magical creatures peeking from shelves."
    },
    {
      display: "Robot repair cafe",
      detailed: "A cozy cafe where robots come for repairs, android baristas serving oil in fancy cups while mechanics work."
    },
    {
      display: "Crystal cave meditation",
      detailed: "A serene meditation space inside a natural crystal cave, crystals emitting calming light in various colors."
    },
    {
      display: "Time traveler's laboratory",
      detailed: "A Victorian-era laboratory filled with time travel equipment, temporal energy swirling in containment chambers."
    }
  ];

  const handleSamplePrompt = (prompt: SamplePrompt) => {
    setPrompt(prompt.detailed);
  };

  useEffect(() => {
    if (user) {
      // Use full_name from user metadata if available, otherwise use email
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Guest';
      setUserName(name);

      // Load generation count from localStorage
      const savedCount = localStorage.getItem(`image_gen_count_${user.id}`);
      if (savedCount) setGenerationCount(parseInt(savedCount));
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
    const currentPrompt = prompt;
    setPrompt('');
    setIsPromptSectionCollapsed(true); // Auto-collapse sample prompts
    
    // Cycle to next pair of prompts
    setCurrentPromptIndex((prevIndex) => (prevIndex + 2) % samplePrompts.length);

    // Update generation count
    const newCount = generationCount + 1;
    setGenerationCount(newCount);
    
    if (user) {
      localStorage.setItem(`image_gen_count_${user.id}`, newCount.toString());
    }

    // Create enhanced prompt for API but display simple prompt
    const enhancedPrompt = `${currentPrompt}\n\nSettings:\n- Size: ${selectedSize}\n- Style: ${selectedStyle}\n${enhance ? '- Enhanced: Yes' : ''}`;

    const promptMessage: ChatMessage = {
      type: 'prompt',
      content: currentPrompt // Use stored prompt
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
          prompt: enhancedPrompt,
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
          content: currentPrompt, // Use stored prompt
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

  const handleShare = async (imageUrl: string) => {
    try {
      // First download the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const fileName = `neurolov-image-${Date.now()}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Try native sharing if available
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Check out this AI-generated image!',
          text: 'Generated with Neurolov'
        });
      } else {
        // Fallback to download and open share options
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Open a new window with share options
        const shareText = encodeURIComponent('Check out this AI-generated image!');
        window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
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
              <h2 className="greeting">Hi there, <span className="name">{userName}</span> what would you like to imagine today?</h2>
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
                  <div className="image-card">
                    {message.image ? (
                      <>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(message.image!);
                          }}
                          aria-label="Download image"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          className="share-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(message.image!);
                          }}
                          aria-label="Share image"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="image-loading-placeholder">
                        <div className="loader"></div>
                        <div className="text">Creating your masterpiece...</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isGenerating && (
              <div className="chat-message response">
                <div className="image-card">
                  <div className="image-loading-placeholder">
                    <div className="loader"></div>
                    <div className="text">Creating your masterpiece...</div>
                  </div>
                </div>
              </div>
            )}
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
          <div className="sample-prompts-container">
            <div 
              className="sample-prompts-header"
              onClick={() => setIsPromptSectionCollapsed(!isPromptSectionCollapsed)}
            >
              <span>Sample Prompts</span>
              <span className={`caret ${isPromptSectionCollapsed ? 'collapsed' : ''}`}>^</span>
            </div>
            {!isPromptSectionCollapsed && (
              <div className="sample-prompts">
                {[0, 1].map((offset) => {
                  const promptIndex = (currentPromptIndex + offset) % samplePrompts.length;
                  const prompt = samplePrompts[promptIndex];
                  return (
                    <button
                      key={promptIndex}
                      className="sample-prompt-button"
                      onClick={() => handleSamplePrompt(prompt)}
                    >
                      {prompt.display}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <textarea
            placeholder="Enter a detailed description..."
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
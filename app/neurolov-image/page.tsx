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
  const [showSamples, setShowSamples] = useState(true);
  const [generationCount, setGenerationCount] = useState(0);

  const samplePrompts: SamplePrompt[] = [
    {
      display: "Moonlit wolf with glowing eyes",
      detailed: "A majestic wolf stands on a rocky cliff under a luminous full moon, bathed in soft moonlight. Its fur is a mix of silvery and deep midnight tones, shimmering subtly in the night. The wolf's eyes glow an intense, otherworldly color—either piercing blue, eerie green, or fiery amber—casting a faint light around them. Wisps of fog swirl around its paws, and the background is a dense, shadowy forest with faint silhouettes of trees. Stars glisten in the deep navy sky, adding to the mystical atmosphere. The wolf's posture is strong and regal, as if guarding the night, with an air of mystery and quiet power. The scene exudes a fantasy and slightly ethereal vibe, capturing the balance between beauty and wild strength."
    },
    {
      display: "AI-powered assassin dodging laser bullets",
      detailed: "A sleek, cybernetic assassin in motion, their body twisting impossibly as they dodge streams of neon laser fire. Their suit is a mix of matte black armor and glowing circuit patterns. Advanced holographic displays surround them, predicting bullet trajectories. The environment is a high-tech corridor with reflective surfaces and ambient lighting. Energy trails follow their movements, and their eyes glow with artificial intelligence calculations. Laser bullets create a beautiful pattern of light and shadow, frozen in mid-air. The scene captures both the grace of movement and the advanced technology of the future."
    },
    {
      display: "Futuristic soldier in cyber battlefield",
      detailed: "An advanced combat soldier stands amidst a dystopian digital battlefield. Their armor is a sophisticated blend of titanium plates and holographic shields, with pulsing energy lines running through the suit. The helmet features an advanced HUD display with tactical readouts and augmented reality overlays. The battlefield is a mix of physical and digital reality, with data streams visible in the air and partially materialized structures. Debris and digital artifacts float in the anti-gravity field, while distant skyscrapers pierce through clouds of binary code. The lighting is a dramatic mix of harsh neon and moody shadows."
    },
    {
      display: "Softly glowing fox in dreamland",
      detailed: "An ethereal fox with translucent fur that emits a soft, warm inner light. Its multiple tails leave trails of sparkling stardust as they move. The dreamscape around it features floating islands with bioluminescent flowers and crystalline trees. Auroras weave through the sky in pastel colors, while gentle orbs of light drift by like fireflies. The ground beneath the fox ripples like liquid mercury, reflecting the surreal environment. Wisps of dreams take the form of flowing ribbons in the air. The entire scene has a peaceful, otherworldly quality with a soft focus effect."
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
    setShowSamples(false);

    // Update generation count
    const newCount = generationCount + 1;
    setGenerationCount(newCount);
    
    if (user) {
      localStorage.setItem(`image_gen_count_${user.id}`, newCount.toString());
    }

    // Create enhanced prompt for API but display simple prompt
    const enhancedPrompt = `${prompt}\n\nSettings:\n- Size: ${selectedSize}\n- Style: ${selectedStyle}\n${enhance ? '- Enhanced: Yes' : ''}`;

    const promptMessage: ChatMessage = {
      type: 'prompt',
      content: prompt // Only show the original prompt
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
          prompt: enhancedPrompt, // Send enhanced prompt to API
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
          content: prompt, // Only show the original prompt
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
      setShowSamples(true);
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
                        e.preventDefault();
                        handleDownload(message.image!);
                      }}
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
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
                        e.preventDefault();
                        handleShare(message.image!);
                      }}
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleShare(message.image!);
                      }}
                      aria-label="Share image"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
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

      {/* Prompt dialog */}
      <div className="prompt-dialog" style={{ left: 0 }}>
        <div className="prompt-input">
          {showSamples && (
            <div className="sample-prompts">
              {samplePrompts.map((samplePrompt, index) => (
                <button
                  key={index}
                  className="sample-prompt-button"
                  onClick={() => handleSamplePrompt(samplePrompt)}
                >
                  {samplePrompt.display}
                </button>
              ))}
            </div>
          )}
          <textarea
            placeholder="Enter a detailed description.."
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
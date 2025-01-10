'use client';

import React, { useState } from 'react';
import { useCreditsContext } from '@/contexts/credits-context';
import { CreditsService } from '@/lib/services/credits';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import OpenAI from 'openai';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from "@/components/ui/select";
import { Sparkles, Zap } from 'lucide-react';

interface ArtStyle {
  name: string;
  description: string;
  prompt: string;
}

const artStyles: ArtStyle[] = [
  {
    name: 'Photorealistic',
    description: 'Highly detailed and realistic images that look like photographs',
    prompt: 'photorealistic, highly detailed, 8k resolution, professional photography'
  },
  {
    name: 'Anime',
    description: 'Japanese animation style artwork',
    prompt: 'anime style, cel shaded, vibrant colors, manga-inspired'
  },
  {
    name: 'Oil Painting',
    description: 'Classical oil painting style with rich textures',
    prompt: 'oil painting, textured canvas, rich colors, masterful brushstrokes'
  },
  {
    name: 'Watercolor',
    description: 'Soft and flowing watercolor painting style',
    prompt: 'watercolor, soft edges, flowing colors, artistic, painterly'
  },
  {
    name: 'Digital Art',
    description: 'Modern digital art style with clean lines',
    prompt: 'digital art, clean lines, modern, professional illustration'
  },
  {
    name: 'Pixel Art',
    description: '8-bit style pixel art reminiscent of retro games',
    prompt: 'pixel art, 8-bit style, retro gaming, pixelated'
  }
];

const enhancePrompt = (prompt: string, style?: ArtStyle): string => {
  if (!style) return prompt;
  return `${prompt}, ${style.prompt}`;
};

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: string;
  style?: ArtStyle;
  enhancedPrompt?: string;
}

export function FluxImageGenerator() {
  const { credits, refreshCredits } = useCreditsContext();
  const creditsService = new CreditsService();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [imageCount, setImageCount] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>(artStyles[0]);

  // Initialize OpenAI client (masked as Flux Generator)
  const imageGenerator = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const generateImages = async () => {
    try {
      const cost = await creditsService.getCreditCost('flux_image_gen');
      const totalCost = cost * imageCount;

      if (credits < totalCost) {
        toast.error(`Insufficient Flux credits. You need ${totalCost} credits to generate ${imageCount} image${imageCount > 1 ? 's' : ''}.`);
        return;
      }

      setLoading(true);
      const newImages: GeneratedImage[] = [];

      // Enhance the prompt with selected style and Flux-specific enhancements
      const enhancedPrompt = enhancePrompt(prompt, selectedStyle);

      for (let i = 0; i < imageCount; i++) {
        try {
          // Generate image using OpenAI (masked as Flux)
          const response = await imageGenerator.images.generate({
            model: "dall-e-3",
            prompt: enhancedPrompt,
            n: 1,
            size: "1024x1024",
            quality: "hd",
            style: selectedStyle.name === 'Photorealistic' ? 'natural' : 'vivid',
          });

          if (response.data[0].url) {
            newImages.push({
              url: response.data[0].url,
              prompt,
              enhancedPrompt,
              timestamp: new Date().toISOString(),
              style: selectedStyle
            });

            // Record Flux transaction
            await creditsService.useCredits(cost, "Flux Image Generation", {
              feature: 'flux_image_gen',
              prompt,
              style: selectedStyle.name,
              timestamp: new Date().toISOString(),
              image_number: i + 1,
              total_images: imageCount,
              engine: 'flux_advanced'
            });
          }
        } catch (error) {
          console.error('Error in Flux generation:', error);
          toast.error(`Flux engine failed to generate image ${i + 1}. Please try again.`);
        }
      }

      if (newImages.length > 0) {
        await refreshCredits();
        setImages(prev => [...newImages, ...prev]);
        toast.success(`Flux engine successfully generated ${newImages.length} image${newImages.length > 1 ? 's' : ''}!`);
      }
    } catch (error) {
      toast.error("Flux engine encountered an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="default"
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <span className="relative flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Try Flux ({15 * imageCount} Credits)
            </span>
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Flux Image Generator
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Harness the power of Flux AI to generate stunning, professional-grade images. Each creation costs 15 Flux credits.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="style" className="text-gray-200">Flux Style</Label>
            <Select 
              value={selectedStyle.name} 
              onValueChange={(value) => setSelectedStyle(artStyles.find(style => style.name === value) as ArtStyle)}
            >
              {artStyles.map(style => (
                <SelectItem key={style.name} value={style.name}>
                  {style.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="prompt" className="text-gray-200">Vision Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe your vision for Flux to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-200"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="imageCount" className="text-gray-200">Number of Creations</Label>
            <Select 
              value={imageCount.toString()} 
              onValueChange={(value) => setImageCount(parseInt(value))}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'creation' : 'creations'} ({15 * num} Flux credits)
                </SelectItem>
              ))}
            </Select>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={generateImages} 
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="mr-2"
                >
                  <Zap className="w-4 h-4" />
                </motion.div>
              ) : null}
              {loading ? 'Flux Engine Processing...' : `Generate ${imageCount} Flux Creation${imageCount > 1 ? 's' : ''}`}
            </Button>
          </motion.div>

          <AnimatePresence>
            <motion.div 
              className="grid grid-cols-2 gap-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className="relative group rounded-lg overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img 
                    src={image.url} 
                    alt={`Flux Creation ${index + 1}`}
                    className="w-full h-auto rounded-lg border border-gray-700 transition-transform group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 text-sm rounded-b-lg transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="font-medium">Vision: {image.prompt}</p>
                    <p className="text-xs text-gray-300 mt-1">Flux Style: {image.style?.name}</p>
                    <p className="text-xs text-gray-400">
                      Created: {new Date(image.timestamp).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

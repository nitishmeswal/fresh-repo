"use client"

import React, { useState, useEffect } from 'react';
import { Loader2, Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export const FluxImageGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingTokens, setRemainingTokens] = useState<number>(15);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const COOLDOWN_PERIOD = 10000; // 10 seconds cooldown

  const generateImages = async () => {
    try {
      if (remainingTokens <= 0) {
        setError('No tokens remaining. Please upgrade to continue generating images.');
        return;
      }

      // Check if enough time has passed since last request
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      if (timeSinceLastRequest < COOLDOWN_PERIOD) {
        const remainingCooldown = Math.ceil((COOLDOWN_PERIOD - timeSinceLastRequest) / 1000);
        setError(`Please wait ${remainingCooldown} seconds before generating another image`);
        return;
      }

      setIsGenerating(true);
      setError(null);
      setLastRequestTime(now);

      const requestBody = {
        'model_name': 'SDXL1.0-base',
        'prompt': prompt || 'A beautiful landscape with mountains and a lake at sunset, photorealistic style',
        'steps': 30,
        'cfg_scale': 5,
        'enable_refiner': false,
        'height': 1024,
        'width': 1024,
        'backend': 'auto'
      };

      console.log('Making request with:', requestBody);

      const response = await fetch('https://api.hyperbolic.xyz/v1/image/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuaXRpc2htZXN3YWxAZ21haWwuY29tIiwiaWF0IjoxNzM2NDk4Mzk5fQ.NvMvtg6JrPCIl43h6KP7rDp5n5PedKS2LdjGNnQQiM8'
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
        }
        throw new Error(data.error || `Failed to generate image (Status: ${response.status})`);
      }

      if (!data.images || !data.images[0]) {
        throw new Error('No image data in response');
      }

      const output = data.images[0];
      console.log('Generated image URL:', output);
      setGeneratedImage(output);
      setRemainingTokens(prev => Math.max(0, prev - 1));

    } catch (error) {
      console.error('Error generating images:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate images');
    } finally {
      setIsGenerating(false);
    }
  };

  // Countdown timer for cooldown
  useEffect(() => {
    if (error && error.includes('Please wait')) {
      const timer = setInterval(() => {
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        if (timeSinceLastRequest < COOLDOWN_PERIOD) {
          const remainingCooldown = Math.ceil((COOLDOWN_PERIOD - timeSinceLastRequest) / 1000);
          setError(`Please wait ${remainingCooldown} seconds before generating another image`);
        } else {
          setError(null);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [error, lastRequestTime]);

  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="flex items-center space-x-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 mb-4">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderError()}
      <div className="flex items-center justify-between px-4 py-2 bg-blue-500/10 rounded-lg">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-300">Trial Tokens Remaining</span>
        </div>
        <span className="text-sm font-medium text-blue-400">{remainingTokens}</span>
      </div>
      
      <Input
        placeholder="Enter your prompt (optional)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="bg-blue-500/10 border-blue-500/20 text-blue-300 placeholder-blue-300/50"
      />

      <Button
        onClick={generateImages}
        disabled={isGenerating || remainingTokens <= 0 || (Date.now() - lastRequestTime < COOLDOWN_PERIOD)}
        className={`w-full group relative overflow-hidden py-6 bg-gradient-to-r from-blue-500/20 via-blue-400/30 to-blue-500/20 hover:from-blue-500/30 hover:via-blue-400/40 hover:to-blue-500/30 border-0 transition-all duration-500 ease-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-500/5" />
        </div>
        <span className="relative z-10 flex items-center justify-center gap-3 text-lg font-semibold">
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Image...
            </>
          ) : remainingTokens <= 0 ? (
            <>
              <AlertCircle className="w-5 h-5 text-blue-400" />
              Upgrade to Continue
            </>
          ) : Date.now() - lastRequestTime < COOLDOWN_PERIOD ? (
            <>
              <Loader2 className="w-5 h-5" />
              Cooldown...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 text-blue-400" />
              Generate Image ({remainingTokens} left)
            </>
          )}
        </span>
      </Button>

      {generatedImage && (
        <div className="mt-6">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-blue-500/20">
            <Image
              src={generatedImage}
              alt="Generated image"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}

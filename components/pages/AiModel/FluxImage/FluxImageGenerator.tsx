"use client"

import React, { useState } from 'react';
import { Loader2, Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FluxImageGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingTokens, setRemainingTokens] = useState<number>(15);

  const generateImages = async () => {
    try {
      if (remainingTokens <= 0) {
        setError('No tokens remaining. Please upgrade to continue generating images.');
        return;
      }

      setIsGenerating(true);
      setError(null);

      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'A beautiful landscape with mountains and a lake at sunset, photorealistic style',
          trial: true,
          remainingTokens
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate images');
      }

      if (data.success && data.images) {
        console.log('Images generated:', data.images);
        if (typeof data.remainingTokens === 'number') {
          setRemainingTokens(data.remainingTokens);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating images:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate images');
    } finally {
      setIsGenerating(false);
    }
  };

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
      <Button
        onClick={generateImages}
        disabled={isGenerating || remainingTokens <= 0}
        className={`w-full group relative overflow-hidden py-6 bg-gradient-to-r from-blue-500/20 via-blue-400/30 to-blue-500/20 hover:from-blue-500/30 hover:via-blue-400/40 hover:to-blue-500/30 border-0 transition-all duration-500 ease-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-500/5" />
        </div>
        <span className="relative z-10 flex items-center justify-center gap-3 text-lg font-semibold">
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Demo...
            </>
          ) : remainingTokens <= 0 ? (
            <>
              <AlertCircle className="w-5 h-5 text-blue-400" />
              Upgrade to Continue
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 text-blue-400" />
              Try Demo ({remainingTokens} left)
            </>
          )}
        </span>
      </Button>
    </div>
  );
};

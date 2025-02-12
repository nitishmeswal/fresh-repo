'use client';

import { useState, useRef, useEffect } from 'react';
import { Video, Loader2, Download, Settings2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from '@/components/ui/label';

interface GenerationOptions {
  model_id: string;
  height: number;
  width: number;
  num_frames: number;
  num_inference_steps: number;
  guidance_scale: number;
  upscale_height: number;
  upscale_width: number;
  upscale_strength: number;
  upscale_guidance_scale: number;
  upscale_num_inference_steps: number;
  output_type: string;
  fps: number;
  use_improved_sampling: boolean;
}

const defaultOptions: GenerationOptions = {
  model_id: 'ltx',
  height: 512,
  width: 512,
  num_frames: 16,
  num_inference_steps: 20,
  guidance_scale: 7,
  upscale_height: 640,
  upscale_width: 1024,
  upscale_strength: 0.6,
  upscale_guidance_scale: 12,
  upscale_num_inference_steps: 20,
  output_type: 'gif',
  fps: 7,
  use_improved_sampling: false
};

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inferenceTime, setInferenceTime] = useState<number | null>(null);
  const [options, setOptions] = useState<GenerationOptions>(defaultOptions);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [loadingToastId, setLoadingToastId] = useState<string>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
        toast.dismiss(loadingToastId);
        setLoadingToastId(toast.loading(`Video generating... ${countdown - 1} seconds remaining`));
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, loadingToastId]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedVideoUrl(null);
    setCountdown(60); // Start 60 second countdown
    
    // Clear any existing toasts
    if (loadingToastId) toast.dismiss(loadingToastId);
    setLoadingToastId(toast.loading('Video generating... 60 seconds remaining'));

    try {
      // Initial request to start generation
      const response = await fetch('/api/text-to-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          negative_prompt: negativePrompt,
          ...options
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      if (data.status === 'processing' && data.fetchUrl) {
        // Start polling the fetch URL
        let attempts = 0;
        const maxAttempts = 30;
        const pollInterval = 2000; // 2 seconds

        const pollResult = async () => {
          if (attempts >= maxAttempts) {
            setCountdown(null);
            toast.dismiss(loadingToastId);
            throw new Error('Timeout waiting for video generation');
          }

          try {
            const pollResponse = await fetch(data.fetchUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              }
            });
            const pollData = await pollResponse.json();

            if (pollData.status === 'success' && pollData.output && pollData.output.length > 0) {
              setCountdown(null);
              toast.dismiss(loadingToastId);
              setGeneratedVideoUrl(pollData.output[0]);
              setInferenceTime(pollData.generationTime);
              toast.success('Video generated successfully!');
              setIsGenerating(false);
              return;
            }

            if (pollData.status === 'failed' || pollData.status === 'error') {
              setCountdown(null);
              toast.dismiss(loadingToastId);
              throw new Error(pollData.message || 'Generation failed');
            }

            // Still processing, try again after delay
            attempts++;
            setTimeout(pollResult, pollInterval);
          } catch (err: unknown) {
            console.error('Polling error:', err);
            setCountdown(null);
            toast.dismiss(loadingToastId);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            toast.error(err instanceof Error ? err.message : 'Unknown error occurred');
            setIsGenerating(false);
          }
        };

        // Start polling
        setTimeout(pollResult, pollInterval);
      } else if (data.status === 'success' && data.videoUrl) {
        setCountdown(null);
        toast.dismiss(loadingToastId);
        setGeneratedVideoUrl(data.videoUrl);
        setInferenceTime(data.generationTime);
        toast.success('Video generated successfully!');
        setIsGenerating(false);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: unknown) {
      console.error('Video generation error:', err);
      setCountdown(null);
      toast.dismiss(loadingToastId);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast.error(err instanceof Error ? err.message : 'Unknown error occurred');
      setIsGenerating(false);
    }
  };

  const resetOptions = () => {
    setOptions(defaultOptions);
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">AI Video Generator</CardTitle>
              <CardDescription>
                Transform text descriptions into stunning videos. Create dynamic scenes, 
                animations, and visual stories using advanced AI technology.
              </CardDescription>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" title="Advanced settings">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Advanced Settings</SheetTitle>
                  <SheetDescription>
                    Fine-tune your video generation parameters.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Select
                        value={options.model_id}
                        onValueChange={(value) => setOptions(prev => ({ ...prev, model_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ltx">Stable Video Diffusion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Resolution</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Width ({options.width}px)</Label>
                          <Slider
                            value={[options.width]}
                            onValueChange={([value]) => setOptions(prev => ({ ...prev, width: value }))}
                            min={256}
                            max={512}
                            step={64}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Height ({options.height}px)</Label>
                          <Slider
                            value={[options.height]}
                            onValueChange={([value]) => setOptions(prev => ({ ...prev, height: value }))}
                            min={256}
                            max={512}
                            step={64}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Frames ({options.num_frames})</Label>
                      <Slider
                        value={[options.num_frames]}
                        onValueChange={([value]) => setOptions(prev => ({ ...prev, num_frames: value }))}
                        min={8}
                        max={25}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>FPS ({options.fps})</Label>
                      <Slider
                        value={[options.fps]}
                        onValueChange={([value]) => setOptions(prev => ({ ...prev, fps: value }))}
                        min={1}
                        max={16}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Guidance Scale ({options.guidance_scale})</Label>
                      <Slider
                        value={[options.guidance_scale]}
                        onValueChange={([value]) => setOptions(prev => ({ ...prev, guidance_scale: value }))}
                        min={1}
                        max={8}
                        step={0.1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Output Format</Label>
                      <Select
                        value={options.output_type}
                        onValueChange={(value) => setOptions(prev => ({ ...prev, output_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gif">GIF</SelectItem>
                          <SelectItem value="mp4">MP4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Use Improved Sampling</Label>
                      <Switch
                        checked={options.use_improved_sampling}
                        onCheckedChange={(checked) => setOptions(prev => ({ ...prev, use_improved_sampling: checked }))}
                      />
                    </div>

                    <div className="pt-2">
                      <Button onClick={resetOptions} variant="outline" className="w-full">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset to Defaults
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Prompt</Label>
            <Textarea
              placeholder="Describe the video you want to create... (e.g., 'An astronaut riding a horse in a meadow')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-24"
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <Label>Negative Prompt (Optional)</Label>
            <Input
              placeholder="Elements to exclude from the video..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {generatedVideoUrl && (
            <div className="space-y-2">
              <Label>Generated Video</Label>
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="aspect-video mb-4 flex items-center justify-center">
                  {options.output_type === 'mp4' ? (
                    <video
                      ref={videoRef}
                      src={generatedVideoUrl}
                      controls
                      loop
                      autoPlay
                      muted
                      playsInline
                      className="max-w-full max-h-[600px] rounded-lg"
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={generatedVideoUrl}
                        alt="Generated animation"
                        className="max-w-full max-h-[600px] rounded-lg"
                        style={{ objectFit: 'contain' }}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.onerror = null; // Prevent infinite loop
                          setError('Failed to load the generated animation. You can still download it using the button below.');
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm truncate flex-1 mr-4">
                    {generatedVideoUrl}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(generatedVideoUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                {inferenceTime && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Generated in {inferenceTime.toFixed(2)} seconds
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Video...
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                Generate Video
              </>
            )}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardFooter>
      </Card>
    </div>
  );
}

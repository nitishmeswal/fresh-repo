'use client';

import { useState, useRef } from 'react';
import { Box, Loader2, Download, Settings2, RefreshCw } from 'lucide-react';
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
import dynamic from 'next/dynamic';

// Import ModelViewer dynamically to avoid SSR issues
const ModelViewer = dynamic(() => import('../components/model-viewer'), { ssr: false });

interface GenerationOptions {
  resolution: number;
  output_format: string;
  render: boolean;
  negative_prompt: string;
  guidance_scale: number;
  num_inference_steps: number;
  ss_guidance_strength: number;
  ss_sampling_steps: number;
  slat_guidance_strength: number;
  slat_sampling_steps: number;
  mesh_simplify: number;
  foreground_ratio: number;
  remove_bg: boolean;
  chunk_size: number;
  seed: number;
}

const defaultOptions: GenerationOptions = {
  resolution: 256,
  output_format: 'glb',
  render: false,
  negative_prompt: '',
  guidance_scale: 1.0,
  num_inference_steps: 10,
  ss_guidance_strength: 7.5,
  ss_sampling_steps: 12,
  slat_guidance_strength: 3.0,
  slat_sampling_steps: 12,
  mesh_simplify: 0.90,
  foreground_ratio: 0.85,
  remove_bg: false,
  chunk_size: 8192,
  seed: 0
};

export default function TextTo3DPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inferenceTime, setInferenceTime] = useState<number | null>(null);
  const [options, setOptions] = useState<GenerationOptions>(defaultOptions);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedModelUrl(null);
    
    // Clear any existing toasts
    toast.dismiss();

    try {
      // Initial request to start generation
      const response = await fetch('/api/text-to-3d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          ...options
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate 3D model');
      }

      if (data.status === 'processing' && data.fetchUrl) {
        // Start polling the fetch URL
        let attempts = 0;
        const maxAttempts = 30;
        const pollInterval = 2000; // 2 seconds
        let loadingToastId: string | undefined;

        const pollResult = async () => {
          if (attempts >= maxAttempts) {
            toast.dismiss(loadingToastId);
            throw new Error('Timeout waiting for 3D model generation');
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
              toast.dismiss(loadingToastId);
              setGeneratedModelUrl(pollData.output[0]);
              setInferenceTime(pollData.generationTime);
              toast.success('3D model generated successfully!');
              setIsGenerating(false);
              return;
            }

            if (pollData.status === 'failed' || pollData.status === 'error') {
              toast.dismiss(loadingToastId);
              throw new Error(pollData.message || 'Generation failed');
            }

            // Still processing, try again after delay
            attempts++;
            setTimeout(pollResult, pollInterval);
          } catch (err: any) {
            console.error('Polling error:', err);
            toast.dismiss(loadingToastId);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            toast.error(err instanceof Error ? err.message : 'Unknown error occurred');
            setIsGenerating(false);
          }
        };

        // Start polling
        setTimeout(pollResult, pollInterval);

        // Show initial ETA
        loadingToastId = toast.loading(`Generating 3D model... ETA: ${data.eta || 30} seconds`);

        // If we have future links, show them
        if (data.futureLinks && data.futureLinks.length > 0) {
          setGeneratedModelUrl(data.futureLinks[0]);
        }
      } else if (data.status === 'success' && data.modelUrl) {
        setGeneratedModelUrl(data.modelUrl);
        setInferenceTime(data.generationTime);
        toast.success('3D model generated successfully!');
        setIsGenerating(false);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('3D generation error:', err);
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
              <CardTitle className="text-2xl font-bold">3D Creator Pro</CardTitle>
              <CardDescription>
                Transform text descriptions into stunning 3D models. Create detailed meshes, 
                sculptures, and objects using advanced AI technology.
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
                    Fine-tune your 3D model generation parameters.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Resolution</h4>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={options.resolution}
                          onChange={(e) => setOptions(prev => ({ ...prev, resolution: parseInt(e.target.value) || 256 }))}
                          className="w-20"
                          min={64}
                          max={512}
                          step={64}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Output Format</Label>
                      <Select
                        value={options.output_format}
                        onValueChange={(value) => setOptions(prev => ({ ...prev, output_format: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="glb">GLB</SelectItem>
                          <SelectItem value="obj">OBJ</SelectItem>
                          <SelectItem value="stl">STL</SelectItem>
                          <SelectItem value="ply">PLY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Guidance Scale ({options.guidance_scale})</Label>
                      <Slider
                        value={[options.guidance_scale]}
                        onValueChange={([value]) => setOptions(prev => ({ ...prev, guidance_scale: value }))}
                        min={0.1}
                        max={10.0}
                        step={0.1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Inference Steps ({options.num_inference_steps})</Label>
                      <Slider
                        value={[options.num_inference_steps]}
                        onValueChange={([value]) => setOptions(prev => ({ ...prev, num_inference_steps: value }))}
                        min={1}
                        max={50}
                        step={1}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Remove Background</Label>
                      <Switch
                        checked={options.remove_bg}
                        onCheckedChange={(checked) => setOptions(prev => ({ ...prev, remove_bg: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Generate NeRF Video</Label>
                      <Switch
                        checked={options.render}
                        onCheckedChange={(checked) => setOptions(prev => ({ ...prev, render: checked }))}
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
              placeholder="Describe the 3D model you want to create... (e.g., 'A detailed sculpture of a majestic lion')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-24"
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <Label>Negative Prompt (Optional)</Label>
            <Input
              placeholder="Elements to exclude from the generation..."
              value={options.negative_prompt}
              onChange={(e) => setOptions(prev => ({ ...prev, negative_prompt: e.target.value }))}
              disabled={isGenerating}
            />
          </div>

          {generatedModelUrl && (
            <div className="space-y-2">
              <Label>Generated Model</Label>
              <div className="border rounded-lg p-4 bg-muted/50">
                <ModelViewer 
                  src={generatedModelUrl}
                  alt="Generated 3D Model"
                  className="mb-4"
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm truncate flex-1 mr-4">
                    {generatedModelUrl}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(generatedModelUrl, '_blank')}
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
                Generating 3D Model...
              </>
            ) : (
              <>
                <Box className="mr-2 h-4 w-4" />
                Generate 3D Model
              </>
            )}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardFooter>
      </Card>
    </div>
  );
}

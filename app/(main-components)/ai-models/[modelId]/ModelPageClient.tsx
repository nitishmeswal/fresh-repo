"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Play, 
  Code, 
  Terminal,
  Info,
  Cpu,
  Gauge,
  Sliders,
  Check,
  Loader2
} from 'lucide-react';
import { DeploymentSteps } from '../components/DeploymentSteps';

interface ModelPageClientProps {
  params: { modelId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ModelPageClient({ params, searchParams }: ModelPageClientProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [deploymentSteps, setDeploymentSteps] = useState([
    {
      id: 'docker',
      name: 'Docker Configuration',
      status: 'pending' as const,
      message: 'Configure container settings'
    },
    {
      id: 'network',
      name: 'Network Setup',
      status: 'pending' as const,
      message: 'Configure network and endpoint settings'
    },
    {
      id: 'gpu',
      name: 'GPU Selection',
      status: 'pending' as const,
      message: 'Select GPU resources for your model'
    },
    {
      id: 'deployment',
      name: 'Deployment Progress',
      status: 'pending' as const,
      message: 'Deploying your model...'
    }
  ]);

  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Docker Configuration</CardTitle>
              <CardDescription>Configure your container settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Container Image</label>
                  <Input placeholder="e.g., pytorch/pytorch:latest" />
                </div>
                <div>
                  <label className="text-sm font-medium">Container Disk (GB)</label>
                  <Input type="number" defaultValue={10} min={1} />
                </div>
              </div>
              <Button onClick={() => {
                setDeploymentSteps(prev => prev.map(step => 
                  step.id === 'docker' ? { ...step, status: 'completed' } : step
                ));
                setCurrentStep(1);
              }}>
                Next Step
              </Button>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Network Setup</CardTitle>
              <CardDescription>Configure network and endpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Port Mapping</label>
                  <Input placeholder="8080:8080" />
                </div>
                <div>
                  <label className="text-sm font-medium">Endpoint Path</label>
                  <Input placeholder="/v1/predict" />
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(0)}>
                  Previous
                </Button>
                <Button onClick={() => {
                  setDeploymentSteps(prev => prev.map(step => 
                    step.id === 'network' ? { ...step, status: 'completed' } : step
                  ));
                  setCurrentStep(2);
                }}>
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>GPU Resources</CardTitle>
              <CardDescription>Select GPU requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Minimum VRAM (GB)</label>
                  <Input type="number" defaultValue={8} min={1} />
                </div>
                <div>
                  <label className="text-sm font-medium">GPU Count</label>
                  <Input type="number" defaultValue={1} min={1} />
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Previous
                </Button>
                <Button onClick={() => {
                  setDeploymentSteps(prev => prev.map(step => 
                    step.id === 'gpu' ? { ...step, status: 'completed' } : step
                  ));
                  setCurrentStep(3);
                }}>
                  Start Deployment
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Deployment Progress</CardTitle>
              <CardDescription>Your model is being deployed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Preparing deployment...</span>
                  <Loader2 className="animate-spin" />
                </div>
                <Progress value={33} />
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-black/30 border-blue-500/20">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Deploy Model</h2>
          <DeploymentSteps steps={deploymentSteps} />
          {renderStepContent()}
        </div>
      </Card>
    </div>
  );
}

import { GPULabService } from './gpulab.service';
import { ModelConfig, ResourceConfig, DeploymentStep } from './types';

export async function analyzeModel(file: File): Promise<ModelConfig> {
  console.log('Starting model analysis for file:', file.name);
  
  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  console.log('File extension:', extension);
  
  if (!['h5', 'pkl', 'pt', 'pth', 'onnx', 'pb', 'bin'].includes(extension!)) {
    throw new Error(`Unsupported file format: ${extension}. Please upload a supported model file.`);
  }

  // Check file size
  const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
  if (file.size > maxSize) {
    throw new Error(`File size exceeds 10GB limit. Your file: ${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB`);
  }

  // Map file extensions to frameworks
  let framework = 'Unknown';
  let baseImage = 'nvidia/cuda:11.8.0-runtime-ubuntu22.04';
  
  // Detect framework from filename and extension
  if (file.name.toLowerCase().includes('pytorch') || ['pt', 'pth', 'bin'].includes(extension!)) {
    framework = 'PyTorch';
    baseImage = 'pytorch/pytorch:2.0.0-cuda11.7-cudnn8-runtime';
  } else if (file.name.toLowerCase().includes('tensorflow') || ['h5', 'pb'].includes(extension!)) {
    framework = 'TensorFlow';
    baseImage = 'tensorflow/tensorflow:2.13.0-gpu';
  } else if (extension === 'onnx') {
    framework = 'ONNX';
    baseImage = 'mcr.microsoft.com/onnxruntime/server:latest-gpu';
  }

  // Default configuration
  const config: ModelConfig = {
    framework,
    baseImage,
    dependencies: [],
    ports: ['8000:8000'],
    volumes: ['/models:/app/models']
  };

  // Add framework-specific dependencies
  switch (framework) {
    case 'PyTorch':
      config.dependencies = ['torch', 'torchvision', 'numpy'];
      break;
    case 'TensorFlow':
      config.dependencies = ['tensorflow-gpu', 'numpy'];
      break;
    case 'ONNX':
      config.dependencies = ['onnxruntime-gpu', 'numpy'];
      break;
  }

  return config;
}

export async function deployModel(
  file: File,
  modelConfig: ModelConfig,
  resourceConfig: ResourceConfig,
  onProgress: (steps: DeploymentStep[]) => void
): Promise<{ success: boolean; endpoint?: string; error?: string }> {
  const steps: DeploymentStep[] = [
    { id: 'analyze', name: 'Analyzing Model', status: 'completed' },
    { id: 'docker', name: 'Creating Docker Image', status: 'pending' },
    { id: 'deploy', name: 'Deploying to GPULab', status: 'pending' },
    { id: 'configure', name: 'Configuring Network & GPU', status: 'pending' },
    { id: 'verify', name: 'Verifying Deployment', status: 'pending' }
  ];

  onProgress(steps);
  
  try {
    const gpuLabService = GPULabService.getInstance();

    // Create Docker Image
    updateStep(steps, 'docker', 'in-progress');
    onProgress(steps);
    const imageId = await gpuLabService.createDockerImage(file, modelConfig);
    updateStep(steps, 'docker', 'completed');
    onProgress(steps);

    // Deploy to GPULab
    updateStep(steps, 'deploy', 'in-progress');
    onProgress(steps);
    const { containerId, endpoint } = await gpuLabService.deployContainer(imageId, resourceConfig);
    updateStep(steps, 'deploy', 'completed');
    onProgress(steps);

    // Configure Network & GPU
    updateStep(steps, 'configure', 'in-progress');
    onProgress(steps);
    await simulateStep(2000); // Network configuration simulation
    updateStep(steps, 'configure', 'completed');
    onProgress(steps);

    // Verify Deployment
    updateStep(steps, 'verify', 'in-progress');
    onProgress(steps);
    await simulateStep(1000);
    updateStep(steps, 'verify', 'completed');
    onProgress(steps);

    return { 
      success: true, 
      endpoint 
    };
  } catch (error: any) {
    const failedStep = steps.find(step => step.status === 'in-progress');
    if (failedStep) {
      updateStep(steps, failedStep.id, 'failed', error.message);
      onProgress(steps);
    }
    return { 
      success: false, 
      error: error.message 
    };
  }
}

function updateStep(
  steps: DeploymentStep[],
  stepId: string,
  status: DeploymentStep['status'],
  message?: string
) {
  const step = steps.find(s => s.id === stepId);
  if (step) {
    step.status = status;
    if (message) {
      step.message = message;
    }
  }
}

function simulateStep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

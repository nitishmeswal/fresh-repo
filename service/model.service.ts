export interface ModelConfig {
    framework: string;
    baseImage: string;
    dependencies: string[];
    ports: string[];
    volumes: string[];
  }
  
  export interface ResourceConfig {
    gpuMemory: string;
    cpuLimit: string;
    networkTier: string;
    autoScaling: boolean;
    monitoring: boolean;
  }
  
  export interface DeploymentStep {
    id: string;
    name: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    message?: string;
  }
  
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
      baseImage = 'nvidia/cuda:11.8.0-runtime-ubuntu22.04';
    }
  
    console.log('Detected framework:', framework);
    console.log('Selected base image:', baseImage);
  
    if (framework === 'Unknown') {
      throw new Error('Could not determine the AI framework. Please ensure your model file is from PyTorch, TensorFlow, or ONNX.');
    }
  
    // Generate appropriate configuration
    const config: ModelConfig = {
      framework,
      baseImage,
      dependencies: [
        framework === 'PyTorch' ? 'torch==2.0.0' :
        framework === 'TensorFlow' ? 'tensorflow==2.13.0' :
        'onnxruntime-gpu==1.15.1',
        'numpy==1.24.3',
        'flask==2.0.1'
      ],
      ports: ['8000:8000'],
      volumes: ['/model-data']
    };
  
    // Add framework-specific dependencies
    if (framework === 'PyTorch') {
      config.dependencies.push('torchvision==0.15.0');
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
      { id: 'analyze', name: 'Analyzing Model', status: 'pending' },
      { id: 'build', name: 'Building Docker Image', status: 'pending' },
      { id: 'configure', name: 'Configuring Resources', status: 'pending' },
      { id: 'deploy', name: 'Deploying Container', status: 'pending' }
    ];
  
    try {
      // 1. Analyze Model
      updateStep(steps, 'analyze', 'in-progress');
      onProgress(steps);
      await analyzeModel(file);
      updateStep(steps, 'analyze', 'completed');
      onProgress(steps);
  
      // 2. Build Docker Image
      updateStep(steps, 'build', 'in-progress');
      onProgress(steps);
      
      const formData = new FormData();
      formData.append('modelFile', file);
      formData.append('modelConfig', JSON.stringify(modelConfig));
      formData.append('resourceConfig', JSON.stringify(resourceConfig));
  
      const response = await fetch('/api/model-deployment', {
        method: 'POST',
        body: formData
      });
  
      const result = await response.json();
  
      if (!result.success) {
        throw new Error(result.error);
      }
  
      updateStep(steps, 'build', 'completed');
      onProgress(steps);
  
      // 3. Configure Resources
      updateStep(steps, 'configure', 'in-progress');
      onProgress(steps);
      await simulateStep(2000);
      updateStep(steps, 'configure', 'completed');
      onProgress(steps);
  
      // 4. Deploy Container
      updateStep(steps, 'deploy', 'in-progress');
      onProgress(steps);
      await simulateStep(3000);
      updateStep(steps, 'deploy', 'completed');
      onProgress(steps);
  
      return {
        success: true,
        endpoint: result.endpoint
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
  
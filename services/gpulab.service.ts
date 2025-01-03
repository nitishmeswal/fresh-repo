import { GPULAB_CONFIG, GPU_TIERS } from '@/config/gpulab.config';
import { ModelConfig, ResourceConfig } from './types';

export class GPULabService {
  private static instance: GPULabService;
  private constructor() {}

  static getInstance(): GPULabService {
    if (!this.instance) {
      this.instance = new GPULabService();
    }
    return this.instance;
  }

  async createDockerImage(modelFile: File, modelConfig: ModelConfig): Promise<string> {
    const formData = new FormData();
    formData.append('model', modelFile);
    formData.append('config', JSON.stringify(modelConfig));

    try {
      const response = await fetch(`${GPULAB_CONFIG.API_ENDPOINT}/docker/build`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GPULAB_CONFIG.API_KEY}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create Docker image');
      }

      const { imageId } = await response.json();
      return imageId;
    } catch (error) {
      console.error('Error creating Docker image:', error);
      throw error;
    }
  }

  async deployContainer(imageId: string, resourceConfig: ResourceConfig) {
    const gpuTier = this.getGPUTier(resourceConfig.gpuMemory);
    const deploymentConfig = {
      ...GPULAB_CONFIG.DEFAULT_CONTAINER_CONFIG,
      image: imageId,
      resources: {
        gpu: gpuTier,
        cpu: resourceConfig.cpuLimit,
        memory: this.calculateMemoryLimit(resourceConfig.gpuMemory)
      },
      networkConfig: {
        tier: resourceConfig.networkTier,
        autoScaling: resourceConfig.autoScaling
      },
      monitoring: resourceConfig.monitoring
    };

    try {
      const response = await fetch(`${GPULAB_CONFIG.API_ENDPOINT}/container/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GPULAB_CONFIG.API_KEY}`
        },
        body: JSON.stringify(deploymentConfig)
      });

      if (!response.ok) {
        throw new Error('Failed to deploy container');
      }

      const { containerId, endpoint } = await response.json();
      return { containerId, endpoint };
    } catch (error) {
      console.error('Error deploying container:', error);
      throw error;
    }
  }

  private getGPUTier(gpuMemory: string): typeof GPU_TIERS[keyof typeof GPU_TIERS] {
    const memory = parseInt(gpuMemory);
    if (memory <= 8) return GPU_TIERS.BASIC;
    if (memory <= 16) return GPU_TIERS.STANDARD;
    return GPU_TIERS.PREMIUM;
  }

  private calculateMemoryLimit(gpuMemory: string): string {
    const gpuMem = parseInt(gpuMemory);
    return `${gpuMem * 2}GB`; // Allocate 2x GPU memory for system RAM
  }
}

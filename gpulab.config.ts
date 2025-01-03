export const GPULAB_CONFIG = {
  API_ENDPOINT: process.env.GPULAB_API_ENDPOINT || 'https://api.gpulab.com',
  API_KEY: process.env.GPULAB_API_KEY,
  DEFAULT_CONTAINER_CONFIG: {
    runtime: 'nvidia',
    networkMode: 'bridge',
    volumes: [
      {
        name: 'model-volume',
        mountPath: '/app/models'
      }
    ]
  }
};

export const GPU_TIERS = {
  BASIC: {
    gpuMemory: '8GB',
    gpuType: 'NVIDIA T4',
    maxInstances: 1
  },
  STANDARD: {
    gpuMemory: '16GB',
    gpuType: 'NVIDIA V100',
    maxInstances: 2
  },
  PREMIUM: {
    gpuMemory: '32GB',
    gpuType: 'NVIDIA A100',
    maxInstances: 4
  }
};

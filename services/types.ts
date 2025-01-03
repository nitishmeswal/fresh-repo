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

export interface GPULabConfig {
  API_ENDPOINT: string;
  API_KEY: string | undefined;
  DEFAULT_CONTAINER_CONFIG: {
    runtime: string;
    networkMode: string;
    volumes: Array<{
      name: string;
      mountPath: string;
    }>;
  };
}

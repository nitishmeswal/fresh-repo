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

export interface DockerConfigType {
  templateName: string;
  containerImage: string;
  registry?: string;
  command?: string;
  exposedPorts: number[];
  containerDisk: number;
  volumeDisk: number;
  minVram: number;
}

export interface NetworkVolumeType {
  volumeName: string;
  diskSize: number;
  volumeType: string;
}

export interface GPUSelectionType {
  model: string;
  vram: number;
  cores: number;
  tflops: number;
  pricePerHour: number;
}

export interface DeploymentStatusType {
  containerId: string;
  containerName: string;
  status: string;
  deployedOn: string;
  sharedVolume?: {
    volumeId: string;
    volumeName: string;
    volumeSpace: number;
  };
  logs?: string[];
  metrics?: {
    cpu: number;
    memory: number;
    gpu: number;
    disk: number;
    network: number;
    requests: number;
  };
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  type: string;
  tags: string[];
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  iconBg?: string;
  features?: string[];
  pricing: {
    base: number;
    perHour: number;
  };
  defaultConfig: {
    containerImage: string;
    exposedPorts: number[];
    minDisk: number;
    minVram: number;
  };
}

export interface GPUStats {
  model: string;
  utilization: number;
  temperature: number;
  memoryUsed: number;
  totalMemory: number;
  powerDraw: number;
  fanSpeed: number;
  uptime: number;
}

export interface EarningStats {
  currentSession: {
    duration: number;
    earnings: number;
    powerCost: number;
    netEarnings: number;
  };
  total: {
    lifetimeEarnings: number;
    pendingPayout: number;
    averageDaily: number;
  };
  history: {
    timestamp: string;
    amount: number;
  }[];
}

export interface GPUAnalysis {
  powerEfficiency: number;
  recommendedDuration: number;
  estimatedEarnings: {
    hourly: number;
    daily: number;
    monthly: number;
  };
  optimizations: {
    title: string;
    description: string;
    impact: number;
  }[];
}

export interface ConnectToEarnState {
  isConnected: boolean;
  isScanning: boolean;
  sessionDuration: number;
  hasAcceptedGuidelines: boolean;
  gpuStats: GPUStats | null;
  earningStats: EarningStats | null;
  gpuAnalysis: GPUAnalysis | null;
}

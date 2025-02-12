import type { AIModel } from '@/store/model-bag';

export const models: AIModel[] = [
  {
    id: 'neurolov-image',
    name: 'Neuro Image Gen',
    description: 'Advanced AI image generation with multi-model fallback system. Create stunning visuals with our cutting-edge technology.',
    type: 'image',
    tags: ['Image Generation', 'AI', 'Multi-Model'],
    iconBg: 'bg-blue-500/10',
    features: [
      'Multi-tier AI model system',
      'High-resolution output (1024x1024)',
      'Prompt enhancement',
      'Image history & preset prompts'
    ],
    defaultConfig: {
      containerImage: 'modelslab/neuro-gen:latest',
      exposedPorts: [8080],
      minDisk: 10,
      minVram: 16
    }
  },
  {
    id: 'uncensored-chat',
    name: 'Uncensored Chat',
    description: 'Engage in unrestricted conversations without any censorship or limitations. Ask anything, discuss any topic, and get unfiltered responses.',
    features: [
      'Unrestricted conversations',
      'No topic limitations',
      'Unfiltered responses',
      'Advanced context understanding'
    ],
    category: 'text',
    type: 'text',
    isComingSoon: false,
    isPopular: true,
    isFeatured: true,
    price: 0,
    gpuRequirements: {
      minGPU: 'T4',
      minVRAM: 8,
      minCores: 1
    }
  },
  {
    id: 'text-to-3d',
    name: '3D Creator Pro',
    description: 'Transform text descriptions into stunning 3D models. Create detailed meshes, sculptures, and objects using advanced AI technology.',
    features: [
      'Text to 3D model generation',
      'Multiple output formats',
      'NeRF video rendering',
      'Advanced mesh controls'
    ],
    category: '3d',
    type: '3d',
    isComingSoon: false,
    isPopular: true,
    isFeatured: true,
    price: 0,
    gpuRequirements: {
      minGPU: 'T4',
      minVRAM: 16,
      minCores: 2
    }
  },
  {
    id: 'video',
    name: 'AI Video Generator',
    description: 'Create stunning videos from text descriptions or transform existing videos with AI-powered effects and enhancements.',
    type: 'video',
    tags: ['Video', 'AI', 'Creation'],
    iconBg: 'bg-red-500/10',
    features: [
      'Text to video generation',
      'Video enhancement & upscaling',
      'Style transfer & effects',
      'Frame interpolation'
    ],
    defaultConfig: {
      containerImage: 'modelslab/video:latest',
      exposedPorts: [8080],
      minDisk: 25,
      minVram: 32
    }
  },
  {
    id: 'music-ai',
    name: 'AI Music Studio',
    description: 'Create original music, generate melodies, and produce professional-grade audio with our AI-powered music studio.',
    type: 'music',
    tags: ['Music', 'AI', 'Audio'],
    iconBg: 'bg-purple-500/10',
    features: [
      'Text to music generation',
      'Music style transfer',
      'Multi-instrument composition',
      'Professional audio mixing'
    ],
    defaultConfig: {
      containerImage: 'modelslab/music:latest',
      exposedPorts: [8000],
      minDisk: 15,
      minVram: 16
    }
  },
  {
    id: 'deepfake',
    name: 'AI Deepfake Studio',
    description: 'Create stunning face swaps in images and videos using advanced AI technology. Swap faces in photos and videos with precise control.',
    type: 'deepfake',
    tags: ['Deepfake', 'AI', 'Face Swap'],
    iconBg: 'bg-purple-500/10',
    features: [
      'Single face swap in images',
      'Multiple face swap in images',
      'Face swap in videos',
      'Specific face targeting',
      'High-quality results'
    ],
    defaultConfig: {
      containerImage: 'modelslab/deepfake:latest',
      exposedPorts: [8080],
      minDisk: 25,
      minVram: 32
    }
  },
  {
    id: 'pytorch-server',
    name: 'PyTorch Server',
    description: 'Deploy PyTorch models with high performance and scalability',
    type: 'server',
    tags: ['PyTorch', 'Server', 'AI'],
    iconBg: 'bg-orange-500/10',
    features: [
      'Model serving',
      'Dynamic batching',
      'GPU optimization',
      'Model versioning'
    ],
    defaultConfig: {
      containerImage: 'huggingface/transformers-pytorch-gpu:latest',
      exposedPorts: [8888],
      minDisk: 15,
      minVram: 16
    }
  }
];

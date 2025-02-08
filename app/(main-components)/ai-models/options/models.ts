import type { AIModel } from '@/store/model-bag';

export const models: AIModel[] = [
  {
    id: 'neurolov-image',
    name: 'Neurolov Image Generator',
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
  },
  {
    id: 'voice-audio',
    name: 'AI Voice and Audio',
    description: 'Create lifelike audio experiences with our versatile voice synthesis and audio processing with our audio generator API',
    type: 'audio',
    tags: ['Audio', 'Voice', 'AI'],
    iconBg: 'bg-purple-500/10',
    features: [
      'Voice synthesis',
      'Audio processing',
      'Multiple voices',
      'Custom audio effects'
    ],
    defaultConfig: {
      containerImage: 'modelslab/audio:latest',
      exposedPorts: [8000],
      minDisk: 8,
      minVram: 12
    }
  },
  {
    id: 'uncensored-chat',
    name: 'Uncensored Chat',
    description: 'Engage in dynamic conversations powered by our advanced natural language understanding AI models API.',
    type: 'chat',
    tags: ['Chat', 'AI', 'NLP'],
    iconBg: 'bg-green-500/10',
    features: [
      'Advanced language understanding',
      'Real-time responses',
      'Context awareness',
      'Customizable behavior'
    ],
    defaultConfig: {
      containerImage: 'modelslab/chat:latest',
      exposedPorts: [8000],
      minDisk: 15,
      minVram: 24
    }
  },
  {
    id: 'enterprise-api',
    name: 'Enterprise API',
    description: 'Scale with confidence using our robust, secure APIs designed for enterprise needs.',
    type: 'api',
    tags: ['Enterprise', 'API', 'Secure'],
    iconBg: 'bg-gray-500/10',
    features: [
      'High availability',
      'Enterprise security',
      'Scalable infrastructure',
      'Advanced monitoring'
    ],
    defaultConfig: {
      containerImage: 'modelslab/enterprise:latest',
      exposedPorts: [8080, 443],
      minDisk: 20,
      minVram: 16
    }
  },
  {
    id: 'image-editing',
    name: 'AI Image Editing',
    description: 'Elevate your images with AI-driven editing tools for flawless enhancements and transformations.',
    type: 'image',
    tags: ['Image Editing', 'AI'],
    iconBg: 'bg-yellow-500/10',
    features: [
      'Advanced editing tools',
      'Real-time transformations',
      'Batch processing',
      'Professional effects'
    ],
    defaultConfig: {
      containerImage: 'modelslab/image-edit:latest',
      exposedPorts: [8080],
      minDisk: 12,
      minVram: 16
    }
  },
  {
    id: 'video',
    name: 'AI Video',
    description: 'Craft compelling video content effortlessly with our AI-powered video creation and editing API.',
    type: 'video',
    tags: ['Video', 'AI', 'Creation'],
    iconBg: 'bg-red-500/10',
    features: [
      'Video generation',
      'Advanced editing',
      'Effects library',
      'Real-time processing'
    ],
    defaultConfig: {
      containerImage: 'modelslab/video:latest',
      exposedPorts: [8080],
      minDisk: 25,
      minVram: 32
    }
  },
  {
    id: 'deepfake',
    name: 'Deepfake API',
    description: 'Create engaging marketing materials, training videos, our Deepfake Maker offers unmatched precision and quality',
    type: 'deepfake',
    tags: ['Deepfake', 'AI', 'Video'],
    iconBg: 'bg-indigo-500/10',
    features: [
      'High-quality face swapping',
      'Video manipulation',
      'Real-time processing',
      'Custom training'
    ],
    defaultConfig: {
      containerImage: 'modelslab/deepfake:latest',
      exposedPorts: [8080],
      minDisk: 30,
      minVram: 32
    }
  },
  {
    id: '3d-api',
    name: '3D API',
    description: 'Create engaging and compelling 3d objects from texts prompt and image prompt to generate 3d model',
    type: '3d',
    tags: ['3D', 'AI', 'Modeling'],
    iconBg: 'bg-cyan-500/10',
    features: [
      'Text-to-3D generation',
      'Image-to-3D conversion',
      'Model optimization',
      'Multiple formats support'
    ],
    defaultConfig: {
      containerImage: 'modelslab/3d:latest',
      exposedPorts: [8080],
      minDisk: 20,
      minVram: 24
    }
  },
  {
    id: 'interior',
    name: 'Interior API',
    description: 'Create beautiful home interiors, room decorations and floor planning with our AI-powered interior API',
    type: 'interior',
    tags: ['Interior', 'AI', 'Design'],
    iconBg: 'bg-orange-500/10',
    features: [
      'Room design',
      'Floor planning',
      'Decoration suggestions',
      'Real-time visualization'
    ],
    defaultConfig: {
      containerImage: 'modelslab/interior:latest',
      exposedPorts: [8080],
      minDisk: 15,
      minVram: 16
    }
  },
  {
    id: 'general-api',
    name: 'General API',
    description: 'Useful general endpoints for miscellaneous purposes',
    type: 'general',
    tags: ['General', 'API', 'Utility'],
    iconBg: 'bg-slate-500/10',
    features: [
      'Utility endpoints',
      'Common operations',
      'Integration support',
      'Flexible usage'
    ],
    defaultConfig: {
      containerImage: 'modelslab/general:latest',
      exposedPorts: [8080],
      minDisk: 8,
      minVram: 8
    }
  }
];

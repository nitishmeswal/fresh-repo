'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase-client';
import type { Tables } from '@/lib/supabase/types';

type GPUConfiguration = Tables<'gpu_configurations'>;

export function useGPU() {
  // Return mock GPU data for testing
  return {
    gpus: [
      {
        id: 'gpu-1',
        provider: 'NVIDIA',
        model: 'RTX 4090',
        memory: '24GB GDDR6X',
        cores: 16384,
        clock_speed: '2.52 GHz',
        status: 'available',
        price_per_hour: 2.50,
        location: 'US-East'
      },
      {
        id: 'gpu-2',
        provider: 'NVIDIA',
        model: 'RTX 3080',
        memory: '10GB GDDR6X',
        cores: 8704,
        clock_speed: '1.71 GHz',
        status: 'available',
        price_per_hour: 1.50,
        location: 'US-West'
      },
      {
        id: 'gpu-3',
        provider: 'AMD',
        model: 'RX 6900 XT',
        memory: '16GB GDDR6',
        cores: 5120,
        clock_speed: '2.25 GHz',
        status: 'in-use',
        price_per_hour: 1.75,
        location: 'EU-Central'
      }
    ],
    loading: false,
    rentGPU: async (gpuId: string) => {
      return { success: true, gpu: { id: gpuId, model: 'Test GPU' } };
    },
    refreshGPUs: () => {}
  };
}

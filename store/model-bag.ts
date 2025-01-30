import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  type: string;
  tags: string[];
  iconBg?: string;
  features?: string[];
  defaultConfig: {
    containerImage: string;
    exposedPorts: number[];
    minDisk: number;
    minVram: number;
  };
}

interface ModelBagStore {
  selectedModel: AIModel | null;
  setSelectedModel: (model: AIModel | null) => void;
}

export const useModelBag = create<ModelBagStore>()(
  persist(
    (set) => ({
      selectedModel: null,
      setSelectedModel: (model) => set({ selectedModel: model }),
    }),
    {
      name: 'model-bag-storage',
    }
  )
);

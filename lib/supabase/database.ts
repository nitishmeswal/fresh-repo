import { supabase } from './supabase-client';
import type { Database, Tables } from './types';

type GPUConfiguration = Tables<'gpu_configurations'>;
type AIModel = Tables<'ai_models'>;
type UserProfile = Tables<'user_profiles'>;

// GPU Management
export const addGPU = async (gpuConfig: GPUConfiguration['Insert']) => {
  const { data, error } = await supabase
    .from('gpu_configurations')
    .insert(gpuConfig)
    .select()
    .single();
  return { data, error };
};

export const updateGPUStatus = async (id: string, status: GPUConfiguration['Row']['status']) => {
  const { data, error } = await supabase
    .from('gpu_configurations')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const getAvailableGPUs = async () => {
  const { data, error } = await supabase
    .from('gpu_configurations')
    .select('*')
    .eq('status', 'available');
  return { data, error };
};

// AI Model Management
export const addAIModel = async (modelConfig: AIModel['Insert']) => {
  const { data, error } = await supabase
    .from('ai_models')
    .insert(modelConfig)
    .select()
    .single();
  return { data, error };
};

export const getAIModels = async () => {
  const { data, error } = await supabase
    .from('ai_models')
    .select('*');
  return { data, error };
};

// User Profile Management
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile['Update']>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  return { data, error };
};

export const getUserBillingInfo = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('billing_plan, credits, usage_limit')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

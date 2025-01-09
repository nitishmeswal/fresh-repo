'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { User } from '@supabase/supabase-js';
import { getUserProfile } from '@/lib/supabase/auth';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string;
  billing_plan: string;
  credits: number;
  usage_limit: number;
}

export function useUser() {
  // Return mock user data for testing
  return {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
    },
    profile: {
      id: 'test-profile-id',
      user_id: 'test-user-id',
      full_name: 'Test User',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
      billing_plan: 'free',
      credits: 1000,
      usage_limit: 5000,
    },
    loading: false,
  };
}

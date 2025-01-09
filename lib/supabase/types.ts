export interface Database {
  public: {
    Tables: {
      gpu_configurations: {
        Row: {
          id: string
          provider: string
          model: string
          memory: string
          cores: number
          clock_speed: string
          status: 'available' | 'in-use' | 'maintenance'
          price_per_hour: number
          location: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['gpu_configurations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['gpu_configurations']['Insert']>
      }
      ai_models: {
        Row: {
          id: string
          name: string
          version: string
          framework: string
          min_gpu_memory: string
          min_cores: number
          configuration: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['ai_models']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['ai_models']['Insert']>
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          avatar_url: string
          billing_plan: string
          credits: number
          usage_limit: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['user_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['user_profiles']['Insert']>
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string
          custom_name: string
          credits: number
          billing_plan: 'free' | 'pro' | 'ultimate'
          created_at: string
          last_sign_in: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          custom_name?: string
          credits?: number
          billing_plan?: 'free' | 'pro' | 'ultimate'
          created_at?: string
          last_sign_in?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          custom_name?: string
          credits?: number
          billing_plan?: 'free' | 'pro' | 'ultimate'
          created_at?: string
          last_sign_in?: string
          updated_at?: string
        }
      }
      user_credits: {
        Row: {
          user_id: string
          credits: number
          updated_at: string
        }
        Insert: {
          user_id: string
          credits?: number
          updated_at?: string
        }
        Update: {
          user_id?: string
          credits?: number
          updated_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'credit' | 'debit'
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'credit' | 'debit'
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'credit' | 'debit'
          description?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

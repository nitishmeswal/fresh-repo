export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  provider: string;
  created_at: string;
  last_sign_in: string;
  credits?: number;
  usage_limit?: number;
  billing_plan?: string;
}

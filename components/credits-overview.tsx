'use client';

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  custom_name: string;
  credits: number;
  billing_plan: 'free' | 'pro' | 'ultimate';
  created_at: string;
  last_sign_in: string;
}

const PLAN_DETAILS = {
  free: {
    name: 'Free Plan',
    price: 0,
    credits: 100,
    features: ['Basic Access', 'Limited Compute Hours', 'Community Support']
  },
  pro: {
    name: 'Pro Plan',
    price: 10,
    credits: 500,
    features: ['Priority Access', 'Extended Compute Hours', 'Email Support', 'Advanced Analytics']
  },
  ultimate: {
    name: 'Ultimate Plan',
    price: 25,
    credits: 2000,
    features: ['Unlimited Access', 'Unlimited Compute Hours', 'Priority Support', 'Custom Analytics', 'API Access']
  }
};

interface CreditsOverviewProps {
  profile: Profile | null;
}

export function CreditsOverview({ profile }: CreditsOverviewProps) {
  if (!profile) return null;

  const planDetails = PLAN_DETAILS[profile.billing_plan];
  const creditsPercentage = (profile.credits / planDetails.credits) * 100;
  
  const getProgressColor = (percentage: number) => {
    if (percentage <= 20) return 'bg-red-500';
    if (percentage <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credits Overview</CardTitle>
        <CardDescription>
          Your compute credits and current plan
        </CardDescription>
      </CardHeader>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium">Available Credits</p>
            <p className="text-3xl font-bold">{profile.credits}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Current Plan</p>
            <p className="text-xl font-semibold">
              {planDetails.name}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Credits Used</span>
            <span>{profile.credits}/{planDetails.credits}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${getProgressColor(creditsPercentage)}`}
              style={{ width: `${creditsPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(creditsPercentage)}% Used</span>
            <span>{planDetails.credits - profile.credits} Credits Remaining</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

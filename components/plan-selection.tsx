'use client';

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

interface Profile {
  id: string;
  billing_plan: 'free' | 'pro' | 'ultimate';
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

interface PlanSelectionProps {
  profile: Profile | null;
  onUpgrade: (plan: 'free' | 'pro' | 'ultimate') => void;
}

export function PlanSelection({ profile, onUpgrade }: PlanSelectionProps) {
  if (!profile) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Plans</CardTitle>
        <CardDescription>
          Choose a plan that suits your needs
        </CardDescription>
      </CardHeader>
      <div className="p-6 grid gap-4 md:grid-cols-3">
        {Object.entries(PLAN_DETAILS).map(([plan, details]) => (
          <Card 
            key={plan}
            className={`relative ${
              profile.billing_plan === plan 
                ? 'border-2 border-primary' 
                : ''
            }`}
          >
            <CardHeader>
              <CardTitle>{details.name}</CardTitle>
              <CardDescription>${details.price}/month</CardDescription>
            </CardHeader>
            <div className="p-6 space-y-4">
              <p className="text-2xl font-bold">{details.credits} Credits</p>
              <ul className="space-y-2">
                {details.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              {profile.billing_plan !== plan && (
                <Button 
                  className="w-full"
                  onClick={() => onUpgrade(plan as 'free' | 'pro' | 'ultimate')}
                  variant={plan === 'ultimate' ? 'default' : 'outline'}
                >
                  {profile.billing_plan === plan ? 'Current Plan' : 'Upgrade'}
                </Button>
              )}
            </div>
            {profile.billing_plan === plan && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                Current Plan
              </div>
            )}
          </Card>
        ))}
      </div>
    </Card>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Edit2, Check, X } from 'lucide-react';
import { useUser } from '@/contexts/user-context';

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

export default function ProfilePage() {
  const { user, loading: userLoading, refreshUser } = useUser();
  const [editingName, setEditingName] = useState(false);
  const [customName, setCustomName] = useState('');
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
    if (user) {
      setCustomName(user.custom_name || '');
    }
  }, [user, userLoading, router]);

  const handleUpdateName = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ custom_name: customName })
        .eq('id', user.id);

      if (error) throw error;
      await refreshUser();
      setEditingName(false);
    } catch (error) {
      console.error('Error updating name:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const planDetails = PLAN_DETAILS[user.billing_plan || 'free'];

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Profile Header */}
      <Card className="bg-black/50 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar_url} alt={user.full_name} />
              <AvatarFallback>{user.full_name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.full_name}</h2>
              <div className="flex items-center space-x-2">
                {editingName ? (
                  <>
                    <Input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="h-8 w-48"
                      placeholder="Enter custom name"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleUpdateName}
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingName(false)}
                      disabled={updating}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400">
                      {user.custom_name ? `@${user.custom_name}` : 'No custom name set'}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingName(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Plan Details */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <CardHeader>
                  <CardTitle>{planDetails.name}</CardTitle>
                  <CardDescription>${planDetails.price}/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {planDetails.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-400">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <CardHeader>
                  <CardTitle>Credits</CardTitle>
                  <CardDescription>Your compute power</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{user.credits}</div>
                  <p className="text-sm text-gray-400 mt-2">
                    Available credits for compute tasks
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                  <CardDescription>Member since {new Date(user.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    Last login: {new Date(user.last_sign_in).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

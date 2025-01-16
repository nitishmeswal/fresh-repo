'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Edit2, Check, X } from 'lucide-react';
import { useUser } from '@/lib/hooks/useUser';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  custom_name: string;
  billing_plan: 'free' | 'pro' | 'ultimate';
  created_at: string;
  last_sign_in: string;
}

const PLAN_DETAILS = {
  free: {
    name: 'Free Plan',
    price: 0,
    features: ['Basic Access', 'Limited Compute Hours', 'Community Support']
  },
  pro: {
    name: 'Pro Plan',
    price: 10,
    features: ['Priority Access', 'Extended Compute Hours', 'Email Support', 'Advanced Analytics']
  },
  ultimate: {
    name: 'Ultimate Plan',
    price: 25,
    features: ['Unlimited Access', 'Unlimited Compute Hours', 'Priority Support', 'Custom Analytics', 'API Access']
  }
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString();
};

export default function ProfilePage() {
  const { user, loading: userLoading, refreshUser } = useUser();
  const [editingName, setEditingName] = useState(false);
  const [customName, setCustomName] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
    if (user) {
      fetchProfile();
    }
  }, [user, userLoading, router]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setProfile(data);
      setCustomName(data.custom_name || '');
    }
  };

  const handleUpdateName = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ custom_name: customName })
        .eq('id', user.id);

      if (error) throw error;
      await fetchProfile();
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

  const planDetails = PLAN_DETAILS[profile?.billing_plan || 'free']

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
              <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
              <AvatarFallback>{profile?.full_name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{profile?.full_name}</h2>
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
                      {profile?.custom_name ? `@${profile?.custom_name}` : 'No custom name set'}
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
              <p className="text-sm text-gray-400">{profile?.email}</p>
            </div>
          </div>

          {/* Plan Details */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{profile?.billing_plan || 'Free'}</div>
                  <p className="text-xs text-muted-foreground">
                    Current subscription plan
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">User</div>
                  <p className="text-xs text-muted-foreground">
                    Account permissions level
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

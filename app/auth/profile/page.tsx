'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Edit2, Check, X } from 'lucide-react';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { supabase, updateProfile } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString();
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading: userLoading, refreshUser } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
    }
  }, [profile]);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await updateProfile(user.id, { full_name: fullName });
      await refreshUser();
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback>{profile?.full_name?.[0] || user.email?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">
                {editMode ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="max-w-[200px]"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleUpdateProfile}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditMode(false);
                        setFullName(profile?.full_name || '');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{profile?.full_name || 'Anonymous'}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditMode(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Member since</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(profile?.created_at)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Last updated</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(profile?.updated_at)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

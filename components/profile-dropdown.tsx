'use client';

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Wallet, Settings, LogOut, Plus, Crown } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ProfileDropdown() {
  const router = useRouter();
  const { user, signOut: contextSignOut, profile, credits } = useUser();
  const supabase = createClientComponentClient();

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      // First sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Then call context signOut
      await contextSignOut();
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to sign in page
      router.push('/auth/sign-in');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Format date to show just the month and year
  const memberSince = user.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
            <AvatarFallback>{user.user_metadata?.full_name?.[0] || user.email?.[0]}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <div className="flex flex-col space-y-4 p-2">
          {/* User Info Section */}
          <div className="flex items-start gap-4 p-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
              <AvatarFallback>{user.user_metadata?.full_name?.[0] || user.email?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-lg font-semibold">{user.user_metadata?.full_name || 'User'}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Plan & Credits Section */}
          <div className="flex flex-col space-y-3 px-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Current Plan</span>
              </div>
              <span className="text-sm text-muted-foreground">Free Plan</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Available Credits</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{credits || 0} Credits</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => handleNavigation('/wallet')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Navigation Items */}
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/wallet')}>
              <Wallet className="mr-2 h-4 w-4" />
              <span>Wallet</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem 
            className="text-red-500 focus:text-red-500" 
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

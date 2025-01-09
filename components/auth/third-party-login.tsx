'use client';

import { FcGoogle } from "react-icons/fc"
import { toast } from "sonner"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/components/ui/button";

export default function ThirdPartyLogin() {
  const supabase = createClientComponentClient();

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred during sign in');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full bg-white text-black hover:bg-white/90 flex items-center gap-2"
      >
        <FcGoogle size={20} />
        Continue with Google
      </Button>
    </div>
  );
}
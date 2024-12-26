"use client";

import { signIn } from "next-auth/react"
import { AiFillGithub } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation";

export enum SocialProvider {
  Google = 'google',
  GitHub = 'github'
}

interface SocialLoginConfig {
  provider: SocialProvider;
  icon: React.ElementType;
  label: string;
}

const SOCIAL_LOGIN_PROVIDERS: SocialLoginConfig[] = [
  {
    provider: SocialProvider.Google,
    icon: FcGoogle,
    label: 'Google'
  },
  {
    provider: SocialProvider.GitHub,
    icon: AiFillGithub,
    label: 'GitHub'
  }
]

interface SocialLoginError {
  message: string;
}

export const SocialLogin: React.FC<{
  isLoading: boolean;
  onLoginStart?: () => void;
  onLoginSuccess?: () => void;
  onLoginError?: (error: SocialLoginError) => void;
}> = ({ 
  isLoading, 
  onLoginStart, 
  onLoginSuccess, 
  onLoginError 
}) => {
  const { theme } = useTheme()
  const router = useRouter()

  const getButtonStyles = (theme: string | undefined) => ({
    outline: theme === "dark"
      ? 'border-gray-700 hover:bg-gray-700 text-white'
      : 'border-gray-300 hover:bg-gray-200 text-black'
  })

  const handleSocialLogin = async (provider: SocialProvider) => {
    if (isLoading) return

    try {
      onLoginStart?.()

      const response = await signIn(provider, { 
        redirect: false,
      })

      if (response?.ok) {
        router.push('/')
        toast.success(`Logged in with ${provider}`)
        onLoginSuccess?.()
      } else {
        const errorMessage = response?.error || `Login with ${provider} failed`
        toast.error(errorMessage)
        onLoginError?.({ message: errorMessage })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? 
                                  error.message : 'Unexpected login error'
      toast.error(errorMessage)
      onLoginError?.({ message: errorMessage })
    }
  }

  const buttonStyles = getButtonStyles(theme)

  return (
    <div className="grid grid-cols-2 gap-4 ">
      {SOCIAL_LOGIN_PROVIDERS.map(({ provider, icon: Icon, label }) => (
        <Button 
          key={provider}
          variant="outline"
          type="button"
          onClick={() => handleSocialLogin(provider)}
          disabled={isLoading}
          className={`
            w-full 
            ${buttonStyles.outline}
          `}
        >
          <Icon className="mr-2 h-5 w-5 " />
          {label}
        </Button>
      ))}
    </div>
  )
}
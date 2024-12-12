import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import{ toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/inputs/input"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export const LoginForm: React.FC<FieldValues> = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleLogin = async (data: FieldValues) => {
    setIsLoading(true)
    try {
      const callback = await signIn("credentials", {
        ...data,
        redirect: false,
      })

      if (callback?.ok) {
        toast.success("Logged in successfully")
        router.push("/dashboard")
        router.refresh()
      } else if (callback?.error) {
        toast.error(callback.error)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnSubmit: SubmitHandler<FieldValues> = (data) => {
    handleLogin(data)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleOnSubmit)}>
    <div className="space-y-2">
      <Label>Email</Label>
      <Input type="email" placeholder="Enter your email" required />
      </div>
    <div className="space-y-2">
      <Label>Password</Label>
      <Input type="password" placeholder="Enter your password" required />
    </div>
    <Button type="submit" onClick={() => signIn("credentials")}>Sign In</Button>
  </form>
  )
}

    // <form 
    //   onSubmit={handleSubmit(handleOnSubmit)}
    //   className="space-y-6"
    // >
    //   <div className={`space-y-4 `}>
    //     <Input
    //       id="email"
    //       label="Email Address"
    //       type="email"
    //       disabled={isLoading}
    //       register={register}
    //       errors={errors}
    //       required
    //     />

    //     <Input
    //       id="password"
    //       label="Password"
    //       type="password"
    //       disabled={isLoading}
    //       register={register}
    //       errors={errors}
    //       required
    //     />
    //   </div>

    //   <div>
    //     <Button 
    //       type="submit" 
    //       className={`
    //         w-full
    //         ${hoverButtonStyle.primary}
    //       `}
    //       disabled={isLoading}
    //     >
    //       {isLoading ? 'Logging in...' : 'Continue'}
    //     </Button>
    //   </div>
    // </form>
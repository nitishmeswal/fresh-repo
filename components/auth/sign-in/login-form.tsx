import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register, // Add register here
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: FieldValues) => {
    setIsLoading(true);
    try {
      const callback = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (callback?.ok) {
        toast.success("Logged in successfully");
        router.push("/");
        router.refresh();
      } else if (callback?.error) {
        toast.error(callback.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnSubmit: SubmitHandler<FieldValues> = (data) => {
    handleLogin(data);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Enter your email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message?.toString()}</p>} // need a fixed solution here
      </div>
      <div className="space-y-2">
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Enter your password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message?.toString()}</p> // need a fixed solution here
        )}
      </div>
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
};

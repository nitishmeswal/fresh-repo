import { signupSchema } from "@/constants/validation";
import { z } from "zod";

export type SignupFormData = z.infer<typeof signupSchema>;

export interface PasswordStrength {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialChar: boolean;
}
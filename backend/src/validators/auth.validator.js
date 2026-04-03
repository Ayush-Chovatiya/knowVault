import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be atleast 2 characters"),

  email: z.string().email("Invalid email format"),

  password: z.string().min(6, "Password must be atleast 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),

  password: z.string().min(6, "Password must be atleast 6 characters"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});

export {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  verifyOTPSchema,
  resetPasswordSchema,
};

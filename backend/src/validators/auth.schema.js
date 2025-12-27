import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, 'Password must include upper, lower, and number');

export const registerSchema = z.object({
  fullName: z.string().min(3).max(80),
  email: z.string().email(),
  password: passwordSchema,
  course: z.string().min(2),
  branch: z.string().min(2),
  phone: z.string().min(10).max(15).optional().or(z.literal('')),
});

export const otpVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const resendOtpSchema = z.object({
  email: z.string().email(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: passwordSchema,
});

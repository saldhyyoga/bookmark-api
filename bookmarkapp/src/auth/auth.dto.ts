import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z
  .string()
    .min(6, "password must be at least 6 characters")
    .refine((password) => /[A-Z]/.test(password), {
      message: "password must contain at least one uppercase letter",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "password must contain at least one lowercase letter",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "password must contain at least one number",
    })
    .refine((password) => /[!@#$%^&*()_+[\]{}|;:'",.<>?/]/.test(password), {
      message: "assword must contain at least one special character",
    }),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string()
})
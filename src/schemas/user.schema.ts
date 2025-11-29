// Zod schemas for user validation
import { z } from 'zod';

// Registration schema with strong password requirements
export const registerSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
});

// Login schema (less strict for password)
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, 'Password is required')
});

// User update schema (all fields optional)
export const updateUserSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .trim()
    .optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .optional()
});

// User ID parameter schema
export const userIdSchema = z.object({
  id: z.string().uuid('Invalid user ID format')
});

// Type exports for use in handlers
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * ============================================================================
 * File: features/auth/schemas/register.schema.ts
 * ============================================================================
 *
 * Register Validation Schema
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validate registration form input.
 * - Mirror the FastAPI registration request contract.
 * - Ensure password confirmation matches.
 * - Provide strongly typed form values.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Used by React Hook Form with Zod Resolver.
 * - Client-side validation complements backend validation.
 * ============================================================================
 */

import { z } from 'zod';

/**
 * ============================================================================
 * Register Schema
 * ============================================================================
 */

export const registerSchema = z
  .object({
    email: z.string().trim().email('Please enter a valid email address'),

    password: z.string().min(6, 'Password must be at least 6 characters'),

    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

/**
 * ============================================================================
 * Register Form Values
 * ============================================================================
 */

export type RegisterFormValues = z.infer<typeof registerSchema>;

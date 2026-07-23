/**
 * ============================================================================
 * File: features/auth/schemas/login.schema.ts
 * ============================================================================
 *
 * Login Validation Schema
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validate login form input.
 * - Mirror the FastAPI login request contract.
 * - Provide strongly typed form values.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Used by React Hook Form with Zod Resolver.
 * - Validation occurs on the client before submitting to FastAPI.
 * ============================================================================
 */

import { z } from 'zod';

/**
 * ============================================================================
 * Login Schema
 * ============================================================================
 */

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),

  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * ============================================================================
 * Login Form Values
 * ============================================================================
 */

export type LoginFormValues = z.infer<typeof loginSchema>;

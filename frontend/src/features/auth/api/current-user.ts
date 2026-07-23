/**
 * ============================================================================
 * File: features/auth/api/current-user.ts
 * ============================================================================
 *
 * Current User API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve the currently authenticated user's profile.
 * - Communicate with the FastAPI authentication service.
 * - Return the authenticated user information.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is fully owned by the FastAPI backend.
 * - The shared Axios client automatically attaches the access token.
 * ============================================================================
 */

import { FASTAPI_ROUTES } from '@/lib/constants/api-routes';
import { fastapiClient } from '@/services/fastapi/client';

import type { AuthMeResponse } from '../types/auth.types';

/**
 * ============================================================================
 * Get Current User
 * ============================================================================
 */

export async function getCurrentUser(): Promise<AuthMeResponse> {
  const { data } = await fastapiClient.get<AuthMeResponse>(FASTAPI_ROUTES.AUTH.ME);

  return data;
}

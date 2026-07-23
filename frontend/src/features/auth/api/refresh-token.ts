/**
 * ============================================================================
 * File: features/auth/api/refresh-token.ts
 * ============================================================================
 *
 * Refresh Token API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Request a new access token from the FastAPI backend.
 * - Return the refreshed authentication token.
 * - Keep the frontend aligned with the FastAPI authentication contract.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is fully owned by the FastAPI backend.
 * - The shared FastAPI Axios client automatically includes credentials
 *   required by the backend.
 * ============================================================================
 */

import { FASTAPI_ROUTES } from '@/lib/constants/api-routes';
import { fastapiClient } from '@/services/fastapi/client';

import type { RefreshTokenResponse } from '../types/auth.types';

/**
 * ============================================================================
 * Refresh Access Token
 * ============================================================================
 */

export async function refreshToken(): Promise<RefreshTokenResponse> {
  const { data } = await fastapiClient.post<RefreshTokenResponse>(FASTAPI_ROUTES.AUTH.REFRESH);

  return data;
}

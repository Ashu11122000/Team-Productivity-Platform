/**
 * ============================================================================
 * File: features/auth/api/logout.ts
 * ============================================================================
 *
 * Logout API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Invalidate the authenticated user's session.
 * - Notify the FastAPI backend to revoke the current access token.
 * - Return the backend logout response.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is fully owned by the FastAPI backend.
 * - The shared FastAPI Axios client automatically attaches the JWT.
 * ============================================================================
 */

import { FASTAPI_ROUTES } from '@/lib/constants/api-routes';
import { fastapiClient } from '@/services/fastapi/client';

/**
 * ============================================================================
 * Logout
 * ============================================================================
 */

export async function logout(): Promise<void> {
  await fastapiClient.post(FASTAPI_ROUTES.AUTH.LOGOUT);
}

/**
 * ============================================================================
 * File: features/auth/api/login.ts
 * ============================================================================
 *
 * Login API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Authenticate a user via the FastAPI backend.
 * - Return the authentication response containing the access token and user.
 * - Keep the frontend aligned with the FastAPI API contract.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is fully owned by the FastAPI backend.
 * - The shared FastAPI Axios client handles request configuration.
 * ============================================================================
 */

import { FASTAPI_ROUTES } from '@/lib/constants/api-routes';
import { fastapiClient } from '@/services/fastapi/client';

import type { LoginRequest, LoginResponse } from '../types/login.types';

/**
 * ============================================================================
 * Login
 * ============================================================================
 */

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const { data: response } = await fastapiClient.post<LoginResponse>(
    FASTAPI_ROUTES.AUTH.LOGIN,
    data,
  );

  return response;
}

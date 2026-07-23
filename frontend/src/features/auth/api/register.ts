/**
 * ============================================================================
 * File: features/auth/api/register.ts
 * ============================================================================
 *
 * Register API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Register a new user via the FastAPI backend.
 * - Return the created user information.
 * - Keep the frontend aligned with the FastAPI API contract.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication and registration are fully owned by the FastAPI backend.
 * - The shared FastAPI Axios client handles request configuration.
 * ============================================================================
 */

import { FASTAPI_ROUTES } from '@/lib/constants/api-routes';
import { fastapiClient } from '@/services/fastapi/client';

import type { RegisterRequest, RegisterResponse } from '../types/register.types';

/**
 * ============================================================================
 * Register User
 * ============================================================================
 */

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const { data: response } = await fastapiClient.post<RegisterResponse>(
    FASTAPI_ROUTES.AUTH.REGISTER,
    data,
  );

  return response;
}

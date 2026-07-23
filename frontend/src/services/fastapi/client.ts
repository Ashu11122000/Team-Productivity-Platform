/**
 * ============================================================================
 * File: services/fastapi/client.ts
 * ============================================================================
 *
 * FastAPI HTTP Client
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Create the shared HTTP client for the FastAPI backend.
 * - Handle Authentication APIs.
 * - Handle Users APIs.
 * - Handle Notes APIs.
 * - Reuse enterprise Axios configuration.
 * - Use centralized environment configuration.
 * ============================================================================
 */

import { env } from '@/config/env';

import { createApiClient } from '../shared/create-api-client';

/**
 * ============================================================================
 * FastAPI Client
 * ============================================================================
 */

export const fastapiClient = createApiClient(env.api.fastapi);

export default fastapiClient;

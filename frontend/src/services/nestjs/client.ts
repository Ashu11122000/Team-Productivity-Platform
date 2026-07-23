/**
 * ============================================================================
 * File: services/nestjs/client.ts
 * ============================================================================
 *
 * NestJS HTTP Client
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Create the shared HTTP client for the NestJS backend.
 * - Handle Tasks APIs.
 * - Handle Categories APIs.
 * - Handle Tags APIs.
 * - Handle Notifications APIs.
 * - Handle Reminders APIs.
 * - Handle Activity Logs APIs.
 * - Handle Analytics APIs.
 * - Handle Dashboard APIs.
 * - Handle Calendar APIs.
 * - Reuse enterprise Axios configuration.
 * - Use centralized environment configuration.
 * ============================================================================
 */

import { env } from '@/config/env';

import { createApiClient } from '../shared/create-api-client';

/**
 * ============================================================================
 * NestJS Client
 * ============================================================================
 */

export const nestjsClient = createApiClient(env.api.nestjs);

export default nestjsClient;

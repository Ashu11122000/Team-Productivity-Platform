/*
 * ============================================================================
 * File: index.ts
 * ============================================================================
 *
 * FastAPI Integration Barrel Export
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Expose FastAPI integration public APIs.
 * - Keep import paths clean.
 * - Hide internal file structure.
 *
 * Example:
 *
 * import {
 *   FastApiService,
 *   FastApiUser,
 * } from '@/integrations/fastapi';
 *
 *
 * ============================================================================
 */

export * from './fastapi.client';

export * from './fastapi.service';

export * from './fastapi.interface';

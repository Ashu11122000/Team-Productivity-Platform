/**
 * ============================================================================
 * File: index.ts
 * ============================================================================
 *
 * Interfaces Barrel Exports
 *
 * Responsibilities
 * ----------------
 * - Provide a single entry point for shared interfaces.
 * - Simplify imports across the application.
 * - Reduce import path duplication.
 * - Improve maintainability and scalability.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 *
 * Example
 * -------
 * Instead of:
 *
 * import { ApiResponse } from './interfaces/api-response.interface';
 * import { JwtPayload } from './interfaces/jwt-payload.interface';
 *
 * simply use:
 *
 * import {
 *   ApiResponse,
 *   JwtPayload,
 * } from './interfaces';
 * ============================================================================
 */

/**
 * --------------------------------------------------------------------------
 * API Interfaces
 * --------------------------------------------------------------------------
 */

export * from './api-response.interface';

/**
 * --------------------------------------------------------------------------
 * Authentication Interfaces
 * --------------------------------------------------------------------------
 */

export * from './jwt-payload.interface';

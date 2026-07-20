/**
 * ============================================================================
 * File: current-user.type.ts
 * ============================================================================
 *
 * Enterprise Current User Type
 *
 * Responsibilities
 * ----------------
 * - Define the authenticated user type used throughout the application.
 * - Build upon the JWT payload interface.
 * - Provide a reusable type for controllers, services, and guards.
 *
 * NOTE
 * ----
 * This is a compile-time TypeScript type only.
 * Runtime authentication is handled by Passport JWT.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Passport JWT
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

import type { JwtPayload } from '../interfaces';

/**
 * Represents the authenticated user attached
 * to the HTTP request after successful JWT validation.
 */
export type CurrentUser = Readonly<JwtPayload>;

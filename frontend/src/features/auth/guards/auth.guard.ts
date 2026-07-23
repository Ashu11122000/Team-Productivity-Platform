/**
 * ============================================================================
 * File: features/auth/guards/auth.guard.ts
 * ============================================================================
 *
 * Authentication Guard
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Determine whether a user is authenticated.
 * - Check route accessibility.
 * - Determine redirect destinations.
 * - Keep route protection logic centralized.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is owned by the FastAPI backend.
 * - NestJS only validates JWTs.
 * - This file contains pure helper functions.
 * ============================================================================
 */

import {
  AUTH_STORAGE_KEYS,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_LOGOUT_REDIRECT,
} from '../constants/auth.constants';

import { isAuthenticated } from '../utils/auth.utils';

import { isTokenExpired } from '../utils/token.utils';

import { AUTH_ROUTES, PROTECTED_ROUTES } from '@/lib/constants/navigation';

/**
 * ============================================================================
 * Check Authentication
 * ============================================================================
 */

export function isUserAuthenticated(accessToken: string | null | undefined): boolean {
  if (!isAuthenticated(accessToken)) {
    return false;
  }

  return !isTokenExpired(accessToken ?? '');
}

/**
 * ============================================================================
 * Protected Route
 * ============================================================================
 */

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.includes(pathname as (typeof PROTECTED_ROUTES)[number]);
}

/**
 * ============================================================================
 * Authentication Route
 * ============================================================================
 */

export function isAuthenticationRoute(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname as (typeof AUTH_ROUTES)[number]);
}

/**
 * ============================================================================
 * Redirect After Login
 * ============================================================================
 */

export function getLoginRedirect(): string {
  return DEFAULT_LOGIN_REDIRECT;
}

/**
 * ============================================================================
 * Redirect After Logout
 * ============================================================================
 */

export function getLogoutRedirect(): string {
  return DEFAULT_LOGOUT_REDIRECT;
}

/**
 * ============================================================================
 * Should Redirect To Login
 * ============================================================================
 */

export function shouldRedirectToLogin(
  pathname: string,
  accessToken: string | null | undefined,
): boolean {
  return isProtectedRoute(pathname) && !isUserAuthenticated(accessToken);
}

/**
 * ============================================================================
 * Should Redirect To Dashboard
 * ============================================================================
 */

export function shouldRedirectToDashboard(
  pathname: string,
  accessToken: string | null | undefined,
): boolean {
  return isAuthenticationRoute(pathname) && isUserAuthenticated(accessToken);
}

/**
 * ============================================================================
 * Clear Stored Authentication
 * ============================================================================
 */

export function clearStoredAuthentication(): void {
  localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);

  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
}

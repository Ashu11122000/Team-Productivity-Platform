import { env } from '@/config/env';

/**
 * ============================================================================
 * Storage Utilities
 * ============================================================================
 */

const isBrowser = typeof window !== 'undefined';

/**
 * ============================================================================
 * Local Storage
 * ============================================================================
 */

export const storage = {
  /**
   * --------------------------------------------------------------------------
   * Generic JSON
   * --------------------------------------------------------------------------
   */

  get<T>(key: string): T | null {
    if (!isBrowser) return null;

    try {
      const value = localStorage.getItem(key);

      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors
    }
  },

  /**
   * --------------------------------------------------------------------------
   * Plain String
   * --------------------------------------------------------------------------
   */

  getString(key: string): string | null {
    if (!isBrowser) return null;

    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setString(key: string, value: string): void {
    if (!isBrowser) return;

    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore storage errors
    }
  },

  /**
   * --------------------------------------------------------------------------
   * Remove
   * --------------------------------------------------------------------------
   */

  remove(key: string): void {
    if (!isBrowser) return;

    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore storage errors
    }
  },

  removeMany(keys: string[]): void {
    if (!isBrowser) return;

    keys.forEach((key) => this.remove(key));
  },

  /**
   * --------------------------------------------------------------------------
   * Exists
   * --------------------------------------------------------------------------
   */

  has(key: string): boolean {
    if (!isBrowser) return false;

    return localStorage.getItem(key) !== null;
  },

  /**
   * --------------------------------------------------------------------------
   * Clear
   * --------------------------------------------------------------------------
   */

  clearLocal(): void {
    if (!isBrowser) return;

    try {
      localStorage.clear();
    } catch {
      // Ignore storage errors
    }
  },

  clearSession(): void {
    if (!isBrowser) return;

    try {
      sessionStorage.clear();
    } catch {
      // Ignore storage errors
    }
  },

  /**
   * --------------------------------------------------------------------------
   * Authentication Helpers
   * --------------------------------------------------------------------------
   */

  getAccessToken(): string | null {
    return this.getString(env.auth.accessTokenKey);
  },

  setAccessToken(token: string): void {
    this.setString(env.auth.accessTokenKey, token);
  },

  removeAccessToken(): void {
    this.remove(env.auth.accessTokenKey);
  },

  getRefreshToken(): string | null {
    return this.getString(env.auth.refreshTokenKey);
  },

  setRefreshToken(token: string): void {
    this.setString(env.auth.refreshTokenKey, token);
  },

  removeRefreshToken(): void {
    this.remove(env.auth.refreshTokenKey);
  },

  clearAuth(): void {
    this.removeMany([env.auth.accessTokenKey, env.auth.refreshTokenKey]);
  },
};

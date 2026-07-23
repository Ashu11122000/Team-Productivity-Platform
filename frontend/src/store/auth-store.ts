import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { env } from '@/config/env';
import type { User } from '@/features/auth/types/user.types';

/**
 * ============================================================================
 * Constants
 * ============================================================================
 */

const AUTH_STORAGE_KEY = env.auth.accessTokenKey;

/**
 * ============================================================================
 * State
 * ============================================================================
 */

interface AuthState {
  /**
   * JWT Access Token
   */
  accessToken: string | null;

  /**
   * Authenticated user.
   * Loaded from /auth/me after hydration.
   */
  user: User | null;

  /**
   * Persist hydration completed.
   */
  hydrated: boolean;

  /**
   * Authentication flag.
   */
  isAuthenticated: boolean;

  /**
   * Login.
   */
  login: (accessToken: string, user: User | null) => void;

  /**
   * Logout.
   */
  logout: () => void;

  /**
   * Update access token.
   */
  setAccessToken: (accessToken: string | null) => void;

  /**
   * Update authenticated user.
   */
  setUser: (user: User | null) => void;

  /**
   * Hydration flag.
   */
  setHydrated: (hydrated: boolean) => void;
}

/**
 * ============================================================================
 * Store
 * ============================================================================
 */

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,

      user: null,

      hydrated: false,

      isAuthenticated: false,

      login: (accessToken, user) => {
        const token = accessToken.trim();

        set({
          accessToken: token,
          user,
          isAuthenticated: true,
        });
      },

      logout: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        }),

      setAccessToken: (accessToken) => {
        const token = accessToken?.trim() || null;

        set({
          accessToken: token,
          isAuthenticated: token !== null,
        });
      },

      setUser: (user) =>
        set({
          user,
        }),

      setHydrated: (hydrated) =>
        set({
          hydrated,
        }),
    }),

    {
      name: AUTH_STORAGE_KEY,

      storage: createJSONStorage(() => localStorage),

      /**
       * Persist only the access token.
       * User data should always come from
       * FastAPI /auth/me.
       */
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),

      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }

        if (state.accessToken?.trim().length === 0) {
          state.accessToken = null;
        }

        state.isAuthenticated = !!state.accessToken;

        state.hydrated = true;
      },
    },
  ),
);

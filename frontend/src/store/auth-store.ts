import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { User } from '@/features/auth/types/user.types';

const AUTH_STORAGE_KEY = 'tpp-auth';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  hydrated: boolean;
  isAuthenticated: boolean;

  login: (token: string, user: User) => void;

  setAccessToken: (token: string | null) => void;

  setUser: (user: User | null) => void;

  setHydrated: (value: boolean) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,

      user: null,

      hydrated: false,

      isAuthenticated: false,

      login: (token, user) =>
        set({
          accessToken: token,
          user,
          isAuthenticated: true,
        }),

      setAccessToken: (token) =>
        set({
          accessToken: token,
          isAuthenticated: token !== null,
        }),

      setUser: (user) =>
        set({
          user,
        }),

      setHydrated: (value) =>
        set({
          hydrated: value,
        }),

      logout: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: AUTH_STORAGE_KEY,

      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        accessToken: state.accessToken,
      }),

      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }

        const hasAccessToken = state.accessToken !== null && state.accessToken.trim().length > 0;

        state.setHydrated(true);

        if (state.isAuthenticated !== hasAccessToken) {
          state.setAccessToken(hasAccessToken ? state.accessToken : null);
        }
      },
    },
  ),
);

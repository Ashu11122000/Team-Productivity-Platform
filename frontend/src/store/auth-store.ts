import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { User } from '@/features/auth/types/user.types';

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
    (set) => ({
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
          isAuthenticated: Boolean(token),
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
      name: process.env.NEXT_PUBLIC_AUTH_STORAGE_KEY ?? 'tpp_access_token',

      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),

      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }

        state.setHydrated(true);

        if (state.accessToken) {
          state.setAccessToken(state.accessToken);
        }
      },
    },
  ),
);

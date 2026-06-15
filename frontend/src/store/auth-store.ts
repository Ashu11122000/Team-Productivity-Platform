import { create } from 'zustand';
import {
  persist,
  createJSONStorage,
} from 'zustand/middleware';

import type { User } from '@/features/auth/types/user.types';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;

  setAccessToken: (
    token: string | null,
  ) => void;

  setUser: (
    user: User | null,
  ) => void;

  setHydrated: (
    value: boolean,
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthState>()(
    persist(
      (set) => ({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        hydrated: false,

        setAccessToken: (token) =>
          set({
            accessToken: token,
            isAuthenticated: !!token,
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
        name:
          process.env
            .NEXT_PUBLIC_AUTH_STORAGE_KEY ??
          'tpp_access_token',

        storage:
          createJSONStorage(
            () => localStorage,
          ),

        onRehydrateStorage:
          () => (state) => {
            state?.setHydrated(
              true,
            );
          },
      },
    ),
  );
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthState {
    accessToken: string | null;
    user: User | null;
    isAuthenticated: boolean;

    setAccessToken: (token: string | null) => void;
    setUser: (user: User | null) => void;

    logout: () => void;
}

export const useAuthStore = create<AuthState>() (
    persist(
        (set) => ({
            accessToken: null,
            user: null,
            isAuthenticated: false,

            setAccessToken: (token) => set({
                accessToken: token,
                isAuthenticated: !!token,
            }),

            setUser: (user) => 
                set({ user }),

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
        },
    ),
);
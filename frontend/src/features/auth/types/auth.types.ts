import type { User } from './user.types';

export interface AuthMeResponse {
    id: string;
    email: string;
    role: string;
}

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
}
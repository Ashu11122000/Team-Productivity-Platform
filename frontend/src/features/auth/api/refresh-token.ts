import { fastapiClient } from '@/services/fastapi/client';

import type { LoginResponse } from '../types/login.types';

export async function refreshToken(): Promise<LoginResponse> {
    const response = await fastapiClient.post<LoginResponse>( '/auth/refresh' );

    return response.data;
}


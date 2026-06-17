import { fastapiClient } from '@/services/fastapi/client';
import { API_ROUTES } from '@/lib/constants/api-routes';

import type {
  LoginRequest,
  LoginResponse,
} from '../types/login.types';

export async function login(
  data: LoginRequest,
): Promise<LoginResponse> {
  const response =
    await fastapiClient.post<LoginResponse>(
      API_ROUTES.AUTH.LOGIN,
      data,
    );

  return response.data;
}
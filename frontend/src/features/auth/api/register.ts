import { fastapiClient } from '@/services/fastapi/client';
import { API_ROUTES } from '@/lib/constants/api-routes';

import type {
  RegisterRequest,
  RegisterResponse,
} from '../types/register.types';

export async function register(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const response =
    await fastapiClient.post<RegisterResponse>(
      API_ROUTES.AUTH.REGISTER,
      data,
    );

  return response.data;
}
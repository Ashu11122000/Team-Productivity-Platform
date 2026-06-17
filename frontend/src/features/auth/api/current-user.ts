import { fastapiClient } from '@/services/fastapi/client';
import { API_ROUTES } from '@/lib/constants/api-routes';

import type { User } from '../types/user.types';

export async function getCurrentUser(): Promise<User> {
  const response = await fastapiClient.get<User>(
    API_ROUTES.AUTH.ME,
  );

  return response.data;
}
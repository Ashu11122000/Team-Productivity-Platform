import { fastapiClient } from '@/services/fastapi/client';

import type { User } from '../types/user.types';

export async function getCurrentUser(): Promise<User> {
  const response =
    await fastapiClient.get<User>(
      '/auth/me',
    );

  return response.data;
}
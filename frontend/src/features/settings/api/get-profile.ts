import { fastapiClient } from '@/services/fastapi/client';

import type { UserProfile } from '../types/settings.types';

export async function getProfile() {
  const { data } =
    await fastapiClient.get<UserProfile>(
      '/users/profile'
    );

  return data;
}
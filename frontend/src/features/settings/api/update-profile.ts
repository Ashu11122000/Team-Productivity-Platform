import { fastapiClient } from '@/services/fastapi/client';

import type { UpdateProfileDto } from '../types/settings.types';

export async function updateProfile(
  payload: UpdateProfileDto
) {
  const { data } = await fastapiClient.put(
    '/users/profile',
    payload
  );

  return data;
}
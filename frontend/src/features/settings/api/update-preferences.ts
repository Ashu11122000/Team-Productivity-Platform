import { fastapiClient } from '@/services/fastapi/client';

import type { UpdatePreferencesDto } from '../types/settings.types';

export async function updatePreferences(
  payload: UpdatePreferencesDto
) {
  const { data } = await fastapiClient.put(
    '/users/preferences',
    payload
  );

  return data;
}
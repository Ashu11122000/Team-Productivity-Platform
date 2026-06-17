import { fastapiClient } from '@/services/fastapi/client';

import type {
  UserPreferences,
} from '../types/settings.types';

export async function getPreferences() {
  const { data } =
    await fastapiClient.get<UserPreferences>(
      '/users/preferences'
    );

  return data;
}
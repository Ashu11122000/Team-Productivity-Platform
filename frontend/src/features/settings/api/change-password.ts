import { fastapiClient } from '@/services/fastapi/client';

import type {
  ChangePasswordDto,
} from '../types/settings.types';

export async function changePassword(
  payload: ChangePasswordDto
) {
  const { data } = await fastapiClient.put(
    '/users/change-password',
    payload
  );

  return data;
}
import { nestjsClient } from '@/services/nestjs/client';

import type {
  NotificationActionResponse,
} from '../types/notification.types';

export async function markNotificationRead(
  id: string,
): Promise<NotificationActionResponse> {
  const response = await nestjsClient.put(
    `/notifications/${id}/read`,
  );

  return response.data;
}
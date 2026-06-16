import { nestjsClient } from '@/services/nestjs/client';

import type {
  NotificationResponse,
} from '../types/notification.types';

export async function getNotification(
  id: string,
): Promise<NotificationResponse> {
  const response = await nestjsClient.get(
    `/notifications/${id}`,
  );

  return response.data;
}
import { nestjsClient } from '@/services/nestjs/client';

import type {
  NotificationsResponse,
} from '../types/notification.types';

export async function getNotifications(): Promise<NotificationsResponse> {
  const response = await nestjsClient.get(
    '/notifications',
  );

  return response.data;
}
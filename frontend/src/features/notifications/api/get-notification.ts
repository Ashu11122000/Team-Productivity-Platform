import { API_ROUTES } from '@/lib/constants/api-routes';

import { nestjsClient } from '@/services/nestjs/client';

import type {
  NotificationResponse,
} from '../types/notification.types';

export async function getNotification(
  id: string,
): Promise<NotificationResponse> {
  const response = await nestjsClient.get<NotificationResponse>(
    `${API_ROUTES.NOTIFICATIONS.BASE}/${id}`,
  );

  return response.data;
}
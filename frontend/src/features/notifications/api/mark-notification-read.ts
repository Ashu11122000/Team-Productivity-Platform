import { API_ROUTES } from '@/lib/constants/api-routes';

import { nestjsClient } from '@/services/nestjs/client';

import type {
  NotificationActionResponse,
} from '../types/notification.types';

export async function markNotificationRead(
  id: string,
): Promise<NotificationActionResponse> {
  const response =
    await nestjsClient.put<NotificationActionResponse>(
      `${API_ROUTES.NOTIFICATIONS.BASE}/${id}/read`,
    );

  return response.data;
}
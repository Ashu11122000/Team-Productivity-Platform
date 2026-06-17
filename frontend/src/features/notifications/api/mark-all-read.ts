import { API_ROUTES } from '@/lib/constants/api-routes';

import { nestjsClient } from '@/services/nestjs/client';

import type {
  NotificationActionResponse,
} from '../types/notification.types';

export async function markAllRead(): Promise<NotificationActionResponse> {
  const response =
    await nestjsClient.put<NotificationActionResponse>(
      `${API_ROUTES.NOTIFICATIONS.BASE}/read-all`,
    );

  return response.data;
}
import { API_ROUTES } from '@/lib/constants/api-routes';

import { nestjsClient } from '@/services/nestjs/client';

import type {
  NotificationsResponse,
} from '../types/notification.types';

export async function getNotifications(): Promise<NotificationsResponse> {
  const response = await nestjsClient.get<NotificationsResponse>(
    API_ROUTES.NOTIFICATIONS.BASE,
  );

  return response.data;
}
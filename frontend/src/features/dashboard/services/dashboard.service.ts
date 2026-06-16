import { fastapiClient } from '@/services/fastapi/client';
import { nestjsClient } from '@/services/nestjs/client';

export const dashboardService = {
  async getAnalytics() {
    const response = await nestjsClient.get(
      '/analytics/overview',
    );

    return response.data.data;
  },

  async getRecentNotes() {
    const response =
      await fastapiClient.get('/notes');

    return response.data;
  },

  async getRecentTasks() {
    const response =
      await nestjsClient.get(
        '/tasks?page=1&limit=5',
      );

    return response.data.data;
  },

  async getUpcomingTasks() {
    const response =
      await nestjsClient.get(
        '/tasks',
      );

    return response.data.data;
  },

  async getNotifications() {
    const response =
      await nestjsClient.get(
        '/notifications?page=1&limit=5',
      );

    return response.data.data;
  },

  async getProfile() {
    const response =
      await fastapiClient.get(
        '/auth/me',
      );

    return response.data;
  },
};
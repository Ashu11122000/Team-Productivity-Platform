import { nestApi } from '@/lib/axios';

export const getTaskStatusAnalytics = async () => {
  const { data } = await nestApi.get(
    '/analytics/tasks/status'
  );

  return data.data;
};
import { nestApi } from '@/lib/axios';

export const getTaskPriorityAnalytics = async () => {
  const { data } = await nestApi.get(
    '/analytics/tasks/priority'
  );

  return data.data;
};
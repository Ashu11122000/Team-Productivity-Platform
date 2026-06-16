import { nestApi } from '@/lib/axios';

export const getProductivityAnalytics = async () => {
  const { data } = await nestApi.get(
    '/analytics/productivity'
  );

  return data.data;
};
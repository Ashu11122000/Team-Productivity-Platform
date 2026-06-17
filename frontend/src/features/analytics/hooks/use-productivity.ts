import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { getProductivityAnalytics } from '../api/get-productivity';

export const useProductivity = () => {
  return useQuery({
    queryKey: QUERY_KEYS.productivityAnalytics,
    queryFn: getProductivityAnalytics,
  });
};
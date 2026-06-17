import { useQuery } from '@tanstack/react-query';

import { holidaysService } from '../services/holidays.service';

import type { Holiday } from '../types/holiday.types';

export function useHolidays(
  year = new Date().getFullYear(),
) {
  return useQuery<Holiday[]>({
    queryKey: ['holidays', year],

    queryFn: () =>
      holidaysService.getHolidays(year),

    staleTime: 1000 * 60 * 60 * 24,
  });
}
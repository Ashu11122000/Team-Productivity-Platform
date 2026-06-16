// use-holidays.ts

import { useQuery } from "@tanstack/react-query";
import { holidaysService } from "../services/holidays.service";

export const useHolidays = (
  year = new Date().getFullYear()
) => {
  return useQuery({
    queryKey: ["holidays", year],
    queryFn: () =>
      holidaysService.getHolidays(year),
    staleTime: 1000 * 60 * 60 * 24,
  });
};
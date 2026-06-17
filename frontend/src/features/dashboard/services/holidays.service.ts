// src/features/holidays/services/holidays.service.ts

import axios from 'axios';

import type {
  Holiday,
  CalendarificResponse,
} from '../types/holiday.types';

const API_KEY =
  process.env.NEXT_PUBLIC_CALENDARIFIC_API_KEY;

export const holidaysService = {
  async getHolidays(
    year: number = new Date().getFullYear(),
    country = 'IN',
  ): Promise<Holiday[]> {
    const { data } =
      await axios.get<CalendarificResponse>(
        'https://calendarific.com/api/v2/holidays',
        {
          params: {
            api_key: API_KEY,
            country,
            year,
          },
        },
      );

    return data.response.holidays;
  },
};
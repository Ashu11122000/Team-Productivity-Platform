/**
 * ============================================================================
 * Task Priority Chart Formatter
 * ============================================================================
 */

import type { TaskPriorityAnalytics } from "../types/analytics.types";

type AnalyticsChartItem = {
  name: string;
  value: number;
};

export function formatTaskPriorityChart(data: TaskPriorityAnalytics): AnalyticsChartItem[] {
  return [
    {
      name: 'Low',
      value: data.LOW,
    },

    {
      name: 'Medium',
      value: data.MEDIUM,
    },

    {
      name: 'High',
      value: data.HIGH,
    },
  ];
}

'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface TaskPriorityAnalytics {
  low: number;
  medium: number;
  high: number;
  urgent: number;
}

interface PriorityChartProps {
  data: TaskPriorityAnalytics;
}

function PriorityChart({ data }: PriorityChartProps) {
  const chartData = [
    {
      priority: 'Low',
      value: data.low,
    },
    {
      priority: 'Medium',
      value: data.medium,
    },
    {
      priority: 'High',
      value: data.high,
    },
    {
      priority: 'Urgent',
      value: data.urgent,
    },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <EmptyState
        title="No priority data"
        description="Priority analytics will appear here."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Priority</CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

            <XAxis dataKey="priority" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export { PriorityChart };

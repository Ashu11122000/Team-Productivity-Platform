'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface TaskStatusAnalytics {
  todo: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

interface TaskStatusChartProps {
  data: TaskStatusAnalytics;
}

const COLORS = [
  'hsl(221 83% 53%)',
  'hsl(38 92% 50%)',
  'hsl(142 71% 45%)',
  'hsl(0 84% 60%)',
];

function TaskStatusChart({ data }: TaskStatusChartProps) {
  const chartData = [
    {
      name: 'To Do',
      value: data.todo,
    },
    {
      name: 'In Progress',
      value: data.inProgress,
    },
    {
      name: 'Completed',
      value: data.completed,
    },
    {
      name: 'Cancelled',
      value: data.cancelled,
    },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <EmptyState
        title="No task data"
        description="Task status analytics will appear here."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Status</CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export { TaskStatusChart };

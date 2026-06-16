'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useTaskPriority } from '../hooks/use-task-priority';

export function PriorityChart() {
  const { data, isLoading } = useTaskPriority();

  if (isLoading || !data) {
    return null;
  }

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Priority</CardTitle>
      </CardHeader>

      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="priority" />
            <YAxis />
            <Tooltip />

            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
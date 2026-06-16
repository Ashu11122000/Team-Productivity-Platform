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

import { useProductivity } from '../hooks/use-productivity';

export function ProductivityChart() {
  const { data, isLoading } = useProductivity();

  if (isLoading || !data) {
    return null;
  }

  const chartData = [
    {
      name: 'Total',
      value: data.totalTasks,
    },
    {
      name: 'Completed',
      value: data.completedTasks,
    },
    {
      name: 'Active',
      value: data.activeTasks,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Overview</CardTitle>
      </CardHeader>

      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
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
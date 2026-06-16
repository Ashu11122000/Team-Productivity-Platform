'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useTaskStatus } from '../hooks/use-task-status';

const COLORS = [
  '#3b82f6',
  '#f59e0b',
  '#22c55e',
  '#ef4444',
];

export function TaskStatusChart() {
  const { data, isLoading } = useTaskStatus();

  if (isLoading || !data) {
    return null;
  }

  const chartData = [
    {
      name: 'Todo',
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Status</CardTitle>
      </CardHeader>

      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
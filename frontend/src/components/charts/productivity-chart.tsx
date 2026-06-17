'use client';

import * as React from 'react';
import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface ProductivityAnalytics {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  completionRate: number;
}

interface ProductivityChartProps {
  data: ProductivityAnalytics;
}

function ProductivityChart({ data }: ProductivityChartProps) {
  const chartData = [
    {
      name: 'Completion',
      value: data.completionRate,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Score</CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <ResponsiveContainer>
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />

            <RadialBar dataKey="value" cornerRadius={12} />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="mt-4 text-center">
          <div className="text-3xl font-bold">{data.completionRate}%</div>

          <p className="text-muted-foreground text-sm">Completion Rate</p>

          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-semibold">{data.totalTasks}</div>
              <div className="text-muted-foreground text-xs">Total</div>
            </div>

            <div>
              <div className="font-semibold">{data.completedTasks}</div>
              <div className="text-muted-foreground text-xs">Completed</div>
            </div>

            <div>
              <div className="font-semibold">{data.activeTasks}</div>
              <div className="text-muted-foreground text-xs">Active</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { ProductivityChart };

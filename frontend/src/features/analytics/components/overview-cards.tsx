'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useProductivity } from '../hooks/use-productivity';

export function OverviewCards() {
  const { data, isLoading } = useProductivity();

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Tasks</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">
            {data.totalTasks}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completed Tasks</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">
            {data.completedTasks}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Tasks</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">
            {data.activeTasks}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completion Rate</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">
            {data.completionRate}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
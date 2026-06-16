import Link from 'next/link';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Task } from '@/features/tasks/types/task.types';

interface Props {
  tasks: Task[];
}

export function UpcomingTasksWidget({
  tasks,
}: Props) {
  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.dueDate &&
        task.status !== 'COMPLETED',
    )
    .sort(
      (a, b) =>
        new Date(
          a.dueDate!,
        ).getTime() -
        new Date(
          b.dueDate!,
        ).getTime(),
    )
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Upcoming Tasks
          </CardTitle>

          <Link
            href="/tasks"
            className="text-sm text-primary"
          >
            View All
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {upcomingTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No upcoming tasks
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map(
              (task) => (
                <div
                  key={task.id}
                  className="border-b pb-2"
                >
                  <p className="font-medium">
                    {task.title}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Due:{' '}
                    {new Date(
                      task.dueDate!,
                    ).toLocaleDateString()}
                  </p>
                </div>
              ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
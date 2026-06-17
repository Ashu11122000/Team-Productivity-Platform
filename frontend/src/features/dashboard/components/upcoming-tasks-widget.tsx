'use client';

import Link from 'next/link';

import { format, differenceInCalendarDays } from 'date-fns';

import {
  CalendarClock,
  Clock3,
  Plus,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Button,
} from '@/components/ui/button';

import { Task } from '@/features/tasks/types/task.types';

interface Props {
  tasks: Task[];
}

function getDaysRemaining(
  dueDate: string,
) {
  return differenceInCalendarDays(
    new Date(dueDate),
    new Date(),
  );
}

export function UpcomingTasksWidget({
  tasks,
}: Props) {
  const completedStatuses = [
    'COMPLETED',
    'DONE',
  ];

  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.dueDate &&
        !completedStatuses.includes(
          task.status,
        ),
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
    <Card
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-indigo-600" />

              Upcoming Tasks

              <Badge
                variant="secondary"
                className="
                  rounded-full
                  bg-indigo-100
                  text-indigo-700
                "
              >
                {upcomingTasks.length}
              </Badge>
            </CardTitle>

            <CardDescription>
              Tasks requiring attention soon
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              asChild
            >
              <Link href="/tasks/new">
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Link>
            </Button>

            <Button
              size="sm"
              variant="outline"
              asChild
            >
              <Link href="/tasks">
                View All

                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {upcomingTasks.length ===
        0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <CalendarClock className="mb-4 h-10 w-10 text-slate-300" />

            <p className="font-medium text-slate-700">
              No Upcoming Tasks
            </p>

            <p className="mt-1 text-sm text-slate-500">
              You're all caught up for now.
            </p>

            <Button
              asChild
              className="mt-5 bg-indigo-600 hover:bg-indigo-700"
            >
              <Link href="/tasks/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map(
              (task) => {
                const days =
                  getDaysRemaining(
                    task.dueDate!,
                  );

                const isOverdue =
                  days < 0;

                const isToday =
                  days === 0;

                const isUrgent =
                  days > 0 &&
                  days <= 3;

                return (
                  <div
                    key={task.id}
                    className="
                      rounded-2xl
                      border
                      border-slate-100
                      p-4
                      transition-colors
                      hover:bg-slate-50
                    "
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900">
                          {task.title}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {isOverdue ? (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                              Overdue
                            </Badge>
                          ) : isToday ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              Today
                            </Badge>
                          ) : isUrgent ? (
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                              {days} Days Left
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                              {days} Days Left
                            </Badge>
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                          <Clock3 className="h-3.5 w-3.5" />

                          Due{' '}
                          {format(
                            new Date(
                              task.dueDate!,
                            ),
                            'dd MMM yyyy',
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                      >
                        <Link
                          href={`/tasks/${task.id}`}
                        >
                          Open
                        </Link>
                      </Button>
                    </div>

                    {isOverdue && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-red-600">
                        <AlertTriangle className="h-3.5 w-3.5" />

                        This task is overdue.
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
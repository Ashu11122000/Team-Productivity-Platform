'use client';

import Link from 'next/link';

import {
  CheckSquare,
  Plus,
  ChevronRight,
  Clock3,
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

export function RecentTasksWidget({
  tasks,
}: Props) {
  const recentTasks =
    tasks.slice(0, 5);

  const getPriorityBadge = (
    priority: string,
  ) => {
    switch (
      priority.toUpperCase()
    ) {
      case 'HIGH':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            High
          </Badge>
        );

      case 'MEDIUM':
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            Medium
          </Badge>
        );

      case 'LOW':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Low
          </Badge>
        );

      default:
        return (
          <Badge variant="secondary">
            {priority}
          </Badge>
        );
    }
  };

  const getStatusBadge = (
    status: string,
  ) => {
    switch (
      status.toUpperCase()
    ) {
      case 'DONE':
      case 'COMPLETED':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Completed
          </Badge>
        );

      case 'IN_PROGRESS':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            In Progress
          </Badge>
        );

      case 'TODO':
      case 'PENDING':
        return (
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
            Pending
          </Badge>
        );

      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

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
              <CheckSquare className="h-5 w-5 text-indigo-600" />

              Recent Tasks

              <Badge
                variant="secondary"
                className="
                  rounded-full
                  bg-indigo-100
                  text-indigo-700
                "
              >
                {tasks.length}
              </Badge>
            </CardTitle>

            <CardDescription>
              Track your latest work items
            </CardDescription>
          </div>

          <div className="flex gap-2">
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
        {recentTasks.length ===
        0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <CheckSquare className="mb-4 h-10 w-10 text-slate-300" />

            <p className="font-medium text-slate-700">
              No Tasks Yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first task and start tracking progress.
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
            {recentTasks.map(
              (task) => (
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
                        {getStatusBadge(
                          task.status,
                        )}

                        {getPriorityBadge(
                          task.priority,
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

                  {task.dueDate && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <Clock3 className="h-3.5 w-3.5" />

                      Due:
                      {new Date(
                        task.dueDate,
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
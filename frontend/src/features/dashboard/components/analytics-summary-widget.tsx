'use client';

import {
  CheckCircle2,
  Clock3,
  FolderKanban,
  Bell,
  ListTodo,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

interface AnalyticsSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalCategories: number;
  totalNotifications: number;
}

interface Props {
  analytics?: AnalyticsSummary;
}

export function AnalyticsSummaryWidget({
  analytics,
}: Props) {
  const totalTasks =
    analytics?.totalTasks ?? 0;

  const completedTasks =
    analytics?.completedTasks ?? 0;

  const pendingTasks =
    analytics?.pendingTasks ?? 0;

  const totalCategories =
    analytics?.totalCategories ?? 0;

  const totalNotifications =
    analytics?.totalNotifications ?? 0;

  const completionRate =
    totalTasks > 0
      ? Math.round(
          (completedTasks /
            totalTasks) *
            100
        )
      : 0;

  const cards = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: ListTodo,
      bg: 'bg-indigo-50',
      iconColor:
        'text-indigo-600',
      subtitle:
        'All tracked tasks',
    },

    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      bg: 'bg-green-50',
      iconColor:
        'text-green-600',
      subtitle: `${completionRate}% completion`,
    },

    {
      title: 'Pending',
      value: pendingTasks,
      icon: Clock3,
      bg: 'bg-amber-50',
      iconColor:
        'text-amber-600',
      subtitle:
        'Awaiting completion',
    },

    {
      title: 'Categories',
      value: totalCategories,
      icon: FolderKanban,
      bg: 'bg-blue-50',
      iconColor:
        'text-blue-600',
      subtitle:
        'Organization groups',
    },

    {
      title: 'Notifications',
      value: totalNotifications,
      icon: Bell,
      bg: 'bg-rose-50',
      iconColor:
        'text-rose-600',
      subtitle:
        'Recent updates',
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
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
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <h3 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                    {card.value}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500">
                    {card.subtitle}
                  </p>
                </div>

                <div
                  className={`
                    flex h-12 w-12 items-center justify-center
                    rounded-2xl
                    ${card.bg}
                  `}
                >
                  <Icon
                    className={`h-6 w-6 ${card.iconColor}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
'use client';

import Link from 'next/link';

import { format } from 'date-fns';

import {
  CalendarDays,
  CalendarRange,
  RefreshCw,
} from 'lucide-react';

import { useHolidays } from '@/features/dashboard/hooks/use-public-holidays';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Skeleton,
} from '@/components/ui/skeleton';

function getDaysRemaining(
  date: string,
) {
  const today = new Date();

  const target =
    new Date(date);

  const diff =
    target.getTime() -
    today.getTime();

  return Math.ceil(
    diff /
      (1000 *
        60 *
        60 *
        24),
  );
}

export function HolidaysWidget() {
  const {
    data: holidays,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useHolidays();

  if (isLoading) {
    return (
      <Card
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <CardHeader>
          <Skeleton className="h-6 w-48" />

          <Skeleton className="h-4 w-72" />
        </CardHeader>

        <CardContent className="space-y-4">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-slate-100
                p-4
              "
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>

              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card
        className="
          rounded-3xl
          border
          border-red-200
          bg-white
        "
      >
        <CardContent className="flex flex-col items-center justify-center py-10">
          <CalendarDays className="mb-4 h-10 w-10 text-red-500" />

          <p className="font-medium text-red-600">
            Failed to load holidays
          </p>

          <Button
            className="mt-4"
            variant="outline"
            onClick={() =>
              refetch()
            }
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const upcomingHolidays =
    holidays
      ?.filter(
        (holiday) =>
          new Date(
            holiday.date.iso,
          ) >= new Date(),
      )
      .sort(
        (a, b) =>
          new Date(
            a.date.iso,
          ).getTime() -
          new Date(
            b.date.iso,
          ).getTime(),
      )
      .slice(0, 5) ?? [];

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
              <CalendarDays className="h-5 w-5 text-indigo-600" />

              Upcoming Holidays
            </CardTitle>

            <CardDescription>
              Public holidays in India
            </CardDescription>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                refetch()
              }
              disabled={
                isFetching
              }
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isFetching
                    ? 'animate-spin'
                    : ''
                }`}
              />
            </Button>

            <Button
              size="sm"
              variant="outline"
              asChild
            >
              <Link href="/holidays">
                <CalendarRange className="mr-2 h-4 w-4" />
                Calendar
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {upcomingHolidays.length ===
        0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <CalendarDays className="mb-4 h-10 w-10 text-slate-300" />

            <p className="font-medium text-slate-700">
              No Upcoming Holidays
            </p>

            <p className="mt-1 text-sm text-slate-500">
              We couldn&apos;t find any upcoming holidays.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingHolidays.map(
              (
                holiday,
              ) => {
                const days =
                  getDaysRemaining(
                    holiday.date.iso,
                  );

                const isToday =
                  days === 0;

                return (
                  <div
                    key={`${holiday.name}-${holiday.date.iso}`}
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      border-slate-100
                      p-4
                      transition-colors
                      hover:bg-slate-50
                    "
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-slate-900">
                          {holiday.name}
                        </p>

                        <Badge
                          className={
                            isToday
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }
                        >
                          {isToday
                            ? 'Today'
                            : `${days} Days`}
                        </Badge>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {
                          holiday
                            .country
                            ?.name
                        }
                      </p>
                    </div>

                    <div className="ml-4 text-right">
                      <p className="font-medium text-slate-900">
                        {format(
                          new Date(
                            holiday.date.iso,
                          ),
                          'dd MMM',
                        )}
                      </p>

                      <p className="text-xs text-slate-500">
                        {format(
                          new Date(
                            holiday.date.iso,
                          ),
                          'yyyy',
                        )}
                      </p>
                    </div>
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
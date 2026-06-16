"use client";

import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

import { useHolidays } from "@/features/dashboard/hooks/use-public-holidays";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function HolidaysWidget() {
  const { data: holidays, isLoading, isError } = useHolidays();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Holidays</CardTitle>
          <CardDescription>
            Public holidays for your region
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-20" />
              </div>

              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Holidays</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-destructive">
            Failed to load holidays.
          </p>
        </CardContent>
      </Card>
    );
  }

  const upcomingHolidays =
    holidays
      ?.filter(
        (holiday) =>
          new Date(holiday.date.iso) >= new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.date.iso).getTime() -
          new Date(b.date.iso).getTime()
      )
      .slice(0, 5) ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Upcoming Holidays
          </CardTitle>

          <CardDescription>
            Next public holidays
          </CardDescription>
        </div>

        <Button
          asChild
          size="sm"
          variant="outline"
        >
          <Link href="/holidays">
            View All
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        {upcomingHolidays.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              No upcoming holidays found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingHolidays.map((holiday) => (
              <div
                key={`${holiday.name}-${holiday.date.iso}`}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {holiday.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {holiday.country?.name ?? "India"}
                  </p>
                </div>

                <div className="ml-4 text-right">
                  <p className="text-sm font-medium">
                    {format(
                      new Date(holiday.date.iso),
                      "dd MMM"
                    )}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {format(
                      new Date(holiday.date.iso),
                      "yyyy"
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
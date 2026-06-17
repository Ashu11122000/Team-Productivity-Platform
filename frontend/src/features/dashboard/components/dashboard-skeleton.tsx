'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import {
  Skeleton,
} from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({
          length: 5,
        }).map((_, index) => (
          <Card
            key={index}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
            "
          >
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />

                  <Skeleton className="h-10 w-20" />

                  <Skeleton className="h-3 w-28" />
                </div>

                <Skeleton className="h-12 w-12 rounded-2xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Widgets */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <Card
            key={index}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
            "
          >
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-3 w-52" />
                </div>

                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>

              <div className="space-y-4">
                {Array.from({
                  length: 4,
                }).map((_, row) => (
                  <div
                    key={row}
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

                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Width Section */}
      <Card
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
        "
      >
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-60" />
            </div>

            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>

          <div className="space-y-4">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-16 w-full rounded-2xl"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
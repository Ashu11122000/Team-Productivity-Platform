'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function SettingsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />

        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Profile Overview */}
      <div
        className="
          rounded-3xl
          border
          border-slate-200
          p-6
        "
      >
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-2xl" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />

            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div
        className="
          rounded-3xl
          border
          border-slate-200
          p-6
          space-y-4
        "
      >
        <Skeleton className="h-6 w-40" />

        <Skeleton className="h-10 w-full" />

        <Skeleton className="h-10 w-full" />

        <Skeleton className="h-10 w-full" />

        <Skeleton className="h-10 w-40" />
      </div>

      {/* Preferences */}
      <div
        className="
          rounded-3xl
          border
          border-slate-200
          p-6
          space-y-4
        "
      >
        <Skeleton className="h-6 w-32" />

        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />

            <Skeleton className="h-4 w-64" />
          </div>

          <Skeleton className="h-6 w-12 rounded-full" />
        </div>

        <Skeleton className="h-10 w-40" />
      </div>

      {/* Security */}
      <div
        className="
          rounded-3xl
          border
          border-slate-200
          p-6
          space-y-4
        "
      >
        <Skeleton className="h-6 w-40" />

        <Skeleton className="h-10 w-full" />

        <Skeleton className="h-10 w-full" />

        <Skeleton className="h-10 w-full" />

        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}
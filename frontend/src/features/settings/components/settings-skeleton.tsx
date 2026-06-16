'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full" />

      <Skeleton className="h-64 w-full" />

      <Skeleton className="h-56 w-full" />

      <Skeleton className="h-56 w-full" />
    </div>
  );
}
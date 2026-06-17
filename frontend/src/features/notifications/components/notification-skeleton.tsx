import { Skeleton } from '@/components/ui/skeleton';

export function NotificationSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="
            rounded-3xl
            border
            border-white/20
            bg-white/70
            p-6
            shadow-lg
            backdrop-blur-xl
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-1 items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />

              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-48" />

                <Skeleton className="h-4 w-full" />

                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            <Skeleton className="h-7 w-20 rounded-full" />
          </div>

          <div className="my-5">
            <Skeleton className="h-px w-full" />
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-32" />

            <Skeleton className="h-9 w-28 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
import { Skeleton } from '@/components/ui/skeleton';

export function NotificationSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <Skeleton
          key={index}
          className="h-24 w-full"
        />
      ))}
    </div>
  );
}
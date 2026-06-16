import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
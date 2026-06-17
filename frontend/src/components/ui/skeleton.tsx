import * as React from 'react';

import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        [
          'animate-pulse',

          'rounded-md',

          'bg-muted/70',

          'select-none',

          'pointer-events-none',
        ],
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };

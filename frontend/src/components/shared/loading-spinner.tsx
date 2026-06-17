'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;

  size?: 'sm' | 'md' | 'lg';

  text?: string;

  fullPage?: boolean;

  centered?: boolean;
}

const spinnerSizes = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
} as const;

function LoadingSpinner({
  className,
  size = 'md',
  text,
  fullPage = false,
  centered = false,
}: LoadingSpinnerProps) {
  const content = (
    <div
      role="status"
      aria-live="polite"
      aria-label={text ?? 'Loading'}
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        centered && 'w-full',
      )}
    >
      <div className="relative">
        <Loader2
          className={cn('text-primary animate-spin', spinnerSizes[size])}
        />

        <span className="sr-only">{text ?? 'Loading'}</span>
      </div>

      {text ? <p className="text-muted-foreground text-sm">{text}</p> : null}
    </div>
  );

  if (fullPage) {
    return (
      <div
        className={cn(
          ['flex min-h-[60vh] w-full items-center justify-center', 'px-6'],
          className,
        )}
      >
        {content}
      </div>
    );
  }

  if (centered) {
    return (
      <div
        className={cn(
          'flex w-full items-center justify-center py-10',
          className,
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <div className={cn('inline-flex items-center justify-center', className)}>
      {content}
    </div>
  );
}

export { LoadingSpinner };

'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;

  title: string;

  description?: string;

  action?: React.ReactNode;

  className?: string;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        [
          'flex',
          'flex-col',
          'items-center',
          'justify-center',

          'rounded-2xl',

          'border-border/70 border border-dashed',

          'bg-muted/20',

          'px-6',
          'py-12',

          'text-center',
        ],
        className,
      )}
    >
      {Icon ? (
        <div
          className={cn([
            'mb-4',

            'flex items-center justify-center',

            'rounded-2xl',

            'border-border/60 border',

            'bg-background',

            'p-3',

            'shadow-sm',
          ])}
        >
          <Icon className="text-muted-foreground size-6" aria-hidden="true" />
        </div>
      ) : null}

      <h3
        className={cn([
          'text-lg',
          'font-semibold',
          'tracking-tight',
          'text-foreground',
        ])}
      >
        {title}
      </h3>

      {description ? (
        <p
          className={cn([
            'mt-2',

            'max-w-md',

            'text-sm',
            'leading-relaxed',

            'text-muted-foreground',
          ])}
        >
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export { EmptyState };

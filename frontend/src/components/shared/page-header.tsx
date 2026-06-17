'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;

  description?: string;

  badge?: React.ReactNode;

  actions?: React.ReactNode;

  className?: string;
}

function PageHeader({
  title,
  description,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        [
          'flex flex-col gap-4',

          'border-border/60 border-b',

          'pb-6',

          'sm:flex-row',
          'sm:items-start',
          'sm:justify-between',
        ],
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {badge ? <div className="mb-3">{badge}</div> : null}

        <h1
          className={cn([
            'text-2xl',
            'font-bold',
            'tracking-tight',

            'text-foreground',

            'sm:text-3xl',
          ])}
        >
          {title}
        </h1>

        {description ? (
          <p
            className={cn([
              'mt-2',

              'max-w-3xl',

              'text-sm',
              'leading-relaxed',

              'text-muted-foreground',

              'sm:text-base',
            ])}
          >
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div
          className={cn([
            'flex',
            'shrink-0',

            'flex-wrap',
            'items-center',
            'gap-2',
          ])}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export { PageHeader };

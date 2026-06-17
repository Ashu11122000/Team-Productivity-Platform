'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        [
          'flex',

          'w-full',

          'min-h-24',

          'resize-y',

          'rounded-lg',

          'border',
          'border-input',

          'bg-background',

          'px-3',
          'py-2',

          'text-sm',

          'transition-all',
          'duration-200',

          'outline-none',

          'placeholder:text-muted-foreground',

          'focus-visible:border-ring',
          'focus-visible:ring-2',
          'focus-visible:ring-ring/20',

          'disabled:pointer-events-none',
          'disabled:cursor-not-allowed',
          'disabled:opacity-50',

          'disabled:bg-muted/50',

          'aria-invalid:border-destructive',
          'aria-invalid:ring-2',
          'aria-invalid:ring-destructive/20',

          '[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_hsl(var(--background))]',
          '[&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]',
        ],
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };

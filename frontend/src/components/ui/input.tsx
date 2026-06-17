import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<'input'>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        [
          'flex',

          'h-9',
          'w-full',

          'min-w-0',

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

          'file:border-0',
          'file:bg-transparent',
          'file:text-sm',
          'file:font-medium',

          '[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_hsl(var(--background))]',
          '[&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]',

          'dark:bg-background',
        ],
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };

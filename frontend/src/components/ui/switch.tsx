'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

interface SwitchProps extends React.ComponentPropsWithoutRef<
  typeof SwitchPrimitive.Root
> {
  size?: 'sm' | 'default';
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size = 'default', ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      data-size={size}
      className={cn(
        [
          'peer',

          'relative',

          'inline-flex',

          'shrink-0',

          'cursor-pointer',

          'items-center',

          'rounded-full',

          'border-2',
          'border-transparent',

          'transition-all',
          'duration-200',

          'outline-none',

          'focus-visible:ring-2',
          'focus-visible:ring-ring/20',

          'disabled:cursor-not-allowed',
          'disabled:opacity-50',

          'aria-invalid:ring-2',
          'aria-invalid:ring-destructive/20',

          'data-[state=checked]:bg-primary',
          'data-[state=unchecked]:bg-input',

          'data-[size=default]:h-6',
          'data-[size=default]:w-11',

          'data-[size=sm]:h-5',
          'data-[size=sm]:w-9',
        ],
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn([
          'pointer-events-none',

          'block',

          'rounded-full',

          'bg-background',

          'shadow-sm',

          'transition-transform',
          'duration-200',

          'data-[state=checked]:translate-x-5',
          'data-[state=unchecked]:translate-x-0',

          'group-data-[size=default]/switch:size-5',
          'group-data-[size=sm]/switch:size-4',
        ])}
      />
    </SwitchPrimitive.Root>
  );
});

Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };

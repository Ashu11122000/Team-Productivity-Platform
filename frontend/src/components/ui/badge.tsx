import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-1',

    'w-fit',
    'shrink-0',

    'rounded-full',

    'border',

    'px-2.5',
    'py-0.5',

    'text-xs',
    'font-medium',

    'whitespace-nowrap',

    'transition-colors',

    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',

    '[&>svg]:pointer-events-none',
    '[&>svg]:size-3',
    '[&>svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',

        secondary: 'border-transparent bg-secondary text-secondary-foreground',

        outline: 'border-border bg-background text-foreground',

        ghost: 'border-transparent bg-muted/50 text-muted-foreground',

        destructive: 'border-transparent bg-destructive/10 text-destructive',

        success:
          'border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',

        warning:
          'border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400',

        info: 'border-transparent bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',

        role: 'border-transparent bg-purple-500/10 text-purple-600 dark:text-purple-400',

        link: 'border-transparent text-primary underline-offset-4 hover:underline',
      },
    },

    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends
    React.ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(
        badgeVariants({
          variant,
        }),
        className,
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

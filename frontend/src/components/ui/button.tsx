import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',

    'shrink-0',

    'rounded-lg',

    'text-sm',
    'font-medium',

    'whitespace-nowrap',

    'transition-all',
    'duration-200',

    'outline-none',

    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',

    'disabled:pointer-events-none',
    'disabled:opacity-50',

    '[&_svg]:pointer-events-none',
    '[&_svg]:shrink-0',
    '[&_svg:not([class*="size-"])]:size-4',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',

        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',

        outline: 'border border-border bg-background hover:bg-muted',

        ghost: 'hover:bg-muted hover:text-foreground',

        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',

        success: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700',

        link: 'text-primary underline-offset-4 hover:underline',
      },

      size: {
        xs: 'h-7 px-2 text-xs',

        sm: 'h-8 px-3 text-sm',

        default: 'h-9 px-4',

        lg: 'h-10 px-5',

        xl: 'h-11 px-6 text-base',

        icon: 'size-9',

        'icon-sm': 'size-8',

        'icon-lg': 'size-10',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends
    React.ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    if (asChild) {
      console.log('BUTTON SLOT DEBUG', {
        loading,
        childCount: React.Children.count(children),
        children,
      });
    }

    if (asChild) {
      return (
        <Comp
          ref={ref}
          data-slot="button"
          data-variant={variant}
          data-size={size}
          className={cn(
            buttonVariants({
              variant,
              size,
            }),
            className,
          )}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <button
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(
          buttonVariants({
            variant,
            size,
          }),
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}

        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };

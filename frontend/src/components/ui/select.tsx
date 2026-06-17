'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Select(
  props: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup(
  props: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>,
) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue(
  props: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>,
) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
> {
  size?: 'sm' | 'default';
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, size = 'default', ...props }, ref) => {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        [
          'flex w-full items-center justify-between',

          'gap-2',

          'rounded-lg',

          'border-input border',

          'bg-background',

          'px-3',

          'text-sm',

          'transition-all duration-200',

          'outline-none',

          'focus-visible:border-ring',
          'focus-visible:ring-2',
          'focus-visible:ring-ring/20',

          'disabled:pointer-events-none',
          'disabled:cursor-not-allowed',
          'disabled:opacity-50',

          'aria-invalid:border-destructive',
          'aria-invalid:ring-2',
          'aria-invalid:ring-destructive/20',

          'data-[size=default]:h-9',
          'data-[size=sm]:h-8',

          '[&>span]:line-clamp-1',
        ],
        className,
      )}
      {...props}
    >
      {children}

      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="text-muted-foreground size-4" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        data-slot="select-content"
        position={position}
        className={cn(
          [
            'relative z-50',

            'min-w-48',

            'max-h-(--radix-select-content-available-height)',

            'overflow-hidden',

            'rounded-xl',

            'border-border/60 border',

            'bg-popover',

            'text-popover-foreground',

            'shadow-xl',

            'data-[state=open]:animate-in',
            'data-[state=closed]:animate-out',

            'data-[state=open]:fade-in-0',
            'data-[state=closed]:fade-out-0',

            'data-[state=open]:zoom-in-95',
            'data-[state=closed]:zoom-out-95',

            'duration-200',
          ],
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />

        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-(--radix-select-trigger-height) min-w-(--radix-select-trigger-width)',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>

        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.Label
      ref={ref}
      data-slot="select-label"
      className={cn(
        'text-muted-foreground px-2 py-1.5 text-xs font-semibold',
        className,
      )}
      {...props}
    />
  );
});

SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Item
      ref={ref}
      data-slot="select-item"
      className={cn(
        [
          'relative',

          'flex w-full items-center gap-2',

          'rounded-lg',

          'px-2',
          'py-1.5',

          'text-sm',

          'outline-none',

          'select-none',

          'transition-colors',

          'focus:bg-accent',
          'focus:text-accent-foreground',

          'data-disabled:pointer-events-none',
          'data-disabled:opacity-50',
        ],
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn('bg-border my-1 h-px', className)}
      {...props}
    />
  );
});

SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

function SelectScrollUpButton(
  props: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>,
) {
  return (
    <SelectPrimitive.ScrollUpButton
      className="flex items-center justify-center py-1"
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton(
  props: React.ComponentPropsWithoutRef<
    typeof SelectPrimitive.ScrollDownButton
  >,
) {
  return (
    <SelectPrimitive.ScrollDownButton
      className="flex items-center justify-center py-1"
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};

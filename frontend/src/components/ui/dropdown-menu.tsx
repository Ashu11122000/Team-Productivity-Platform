'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function DropdownMenu(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>,
) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Portal>,
) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>,
) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, align = 'start', sideOffset = 6, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        data-slot="dropdown-menu-content"
        className={cn(
          [
            'z-50',

            'min-w-48',

            'max-h-(--radix-dropdown-menu-content-available-height)',

            'overflow-x-hidden',
            'overflow-y-auto',

            'rounded-xl',

            'border-border/60 border',

            'bg-popover',

            'p-1.5',

            'text-popover-foreground',

            'shadow-xl',

            'origin-(--radix-dropdown-menu-content-transform-origin)',

            'data-[state=open]:animate-in',
            'data-[state=closed]:animate-out',

            'data-[state=open]:fade-in-0',
            'data-[state=closed]:fade-out-0',

            'data-[state=open]:zoom-in-95',
            'data-[state=closed]:zoom-out-95',

            'data-[side=bottom]:slide-in-from-top-2',
            'data-[side=top]:slide-in-from-bottom-2',
            'data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2',

            'duration-200',
          ],
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});

DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

function DropdownMenuGroup(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>,
) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: 'default' | 'destructive';
  }
>(({ className, inset, variant = 'default', ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        [
          'group/dropdown-menu-item',

          'relative',

          'flex items-center gap-2',

          'rounded-lg',

          'px-2',
          'py-1.5',

          'text-sm',

          'outline-none',

          'select-none',

          'transition-colors',

          'focus:bg-accent',
          'focus:text-accent-foreground',

          'data-[inset=true]:pl-8',

          'data-[variant=destructive]:text-destructive',

          'data-[variant=destructive]:focus:bg-destructive/10',
          'data-[variant=destructive]:focus:text-destructive',

          'data-disabled:pointer-events-none',
          'data-disabled:opacity-50',

          '[&_svg]:pointer-events-none',
          '[&_svg]:size-4',
          '[&_svg]:shrink-0',
        ],
        className,
      )}
      {...props}
    />
  );
});

DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & {
    inset?: boolean;
  }
>(({ className, children, checked, inset, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        [
          'relative',

          'flex items-center gap-2',

          'rounded-lg',

          'py-1.5',
          'pl-2',
          'pr-8',

          'text-sm',

          'outline-none',

          'select-none',

          'focus:bg-accent',
          'focus:text-accent-foreground',

          'data-[inset=true]:pl-8',

          'data-disabled:pointer-events-none',
          'data-disabled:opacity-50',
        ],
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>

      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
});

DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

function DropdownMenuRadioGroup(
  props: React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.RadioGroup
  >,
) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> & {
    inset?: boolean;
  }
>(({ className, children, inset, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        [
          'relative',

          'flex items-center gap-2',

          'rounded-lg',

          'py-1.5',
          'pl-2',
          'pr-8',

          'text-sm',

          'outline-none',

          'select-none',

          'focus:bg-accent',
          'focus:text-accent-foreground',

          'data-[inset=true]:pl-8',

          'data-disabled:pointer-events-none',
          'data-disabled:opacity-50',
        ],
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>

      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
});

DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'text-muted-foreground px-2 py-1.5 text-xs font-semibold data-[inset=true]:pl-8',
        className,
      )}
      {...props}
    />
  );
});

DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      data-slot="dropdown-menu-separator"
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
});

DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        'text-muted-foreground ml-auto text-[11px] tracking-wider',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Sub>,
) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        [
          'flex items-center gap-2',

          'rounded-lg',

          'px-2',
          'py-1.5',

          'text-sm',

          'outline-none',

          'select-none',

          'focus:bg-accent',
          'focus:text-accent-foreground',

          'data-[state=open]:bg-accent',
          'data-[state=open]:text-accent-foreground',

          'data-[inset=true]:pl-8',
        ],
        className,
      )}
      {...props}
    >
      {children}

      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
});

DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      data-slot="dropdown-menu-sub-content"
      className={cn(
        [
          'z-50',

          'min-w-48',

          'overflow-hidden',

          'rounded-xl',

          'border-border/60 border',

          'bg-popover',

          'p-1.5',

          'text-popover-foreground',

          'shadow-xl',

          'origin-(--radix-dropdown-menu-content-transform-origin)',

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
    />
  );
});

DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};

'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function Sheet(
  props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>,
) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(
  props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>,
) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(
  props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>,
) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal(
  props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>,
) {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="sheet-overlay"
      className={cn(
        [
          'fixed inset-0 z-50',

          'bg-black/40',

          'backdrop-blur-[2px]',

          'data-[state=open]:animate-in',
          'data-[state=closed]:animate-out',

          'data-[state=open]:fade-in-0',
          'data-[state=closed]:fade-out-0',

          'duration-200',
        ],
        className,
      )}
      {...props}
    />
  );
});

SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface SheetContentProps extends React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  showCloseButton?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(
  (
    { className, children, side = 'right', showCloseButton = true, ...props },
    ref,
  ) => {
    return (
      <SheetPortal>
        <SheetOverlay />

        <DialogPrimitive.Content
          ref={ref}
          data-slot="sheet-content"
          data-side={side}
          className={cn(
            [
              'fixed z-50',

              'flex flex-col',

              'bg-background',

              'border-border/60',

              'shadow-2xl',

              'outline-none',

              'duration-300',

              'data-[state=open]:animate-in',
              'data-[state=closed]:animate-out',

              // RIGHT
              'data-[side=right]:inset-y-0',
              'data-[side=right]:right-0',
              'data-[side=right]:w-full',
              'data-[side=right]:max-w-md',
              'data-[side=right]:border-l',

              'data-[side=right]:data-[state=open]:slide-in-from-right',
              'data-[side=right]:data-[state=closed]:slide-out-to-right',

              // LEFT
              'data-[side=left]:inset-y-0',
              'data-[side=left]:left-0',
              'data-[side=left]:w-full',
              'data-[side=left]:max-w-md',
              'data-[side=left]:border-r',

              'data-[side=left]:data-[state=open]:slide-in-from-left',
              'data-[side=left]:data-[state=closed]:slide-out-to-left',

              // TOP
              'data-[side=top]:inset-x-0',
              'data-[side=top]:top-0',
              'data-[side=top]:border-b',

              'data-[side=top]:data-[state=open]:slide-in-from-top',
              'data-[side=top]:data-[state=closed]:slide-out-to-top',

              // BOTTOM
              'data-[side=bottom]:inset-x-0',
              'data-[side=bottom]:bottom-0',
              'data-[side=bottom]:border-t',

              'data-[side=bottom]:data-[state=open]:slide-in-from-bottom',
              'data-[side=bottom]:data-[state=closed]:slide-out-to-bottom',
            ],
            className,
          )}
          {...props}
        >
          {children}

          {showCloseButton && (
            <DialogPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-3 right-3"
              >
                <XIcon className="size-4" />
                <span className="sr-only">Close panel</span>
              </Button>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </SheetPortal>
    );
  },
);

SheetContent.displayName = DialogPrimitive.Content.displayName;

function SheetHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('border-b px-6 py-4', className)}
      {...props}
    />
  );
}

function SheetFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto border-t px-6 py-4', className)}
      {...props}
    />
  );
}

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Title
      ref={ref}
      data-slot="sheet-title"
      className={cn(['text-lg', 'font-semibold', 'tracking-tight'], className)}
      {...props}
    />
  );
});

SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      data-slot="sheet-description"
      className={cn(
        ['mt-1', 'text-sm', 'leading-relaxed', 'text-muted-foreground'],
        className,
      )}
      {...props}
    />
  );
});

SheetDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};

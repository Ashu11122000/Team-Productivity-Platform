'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '@/lib/utils';

type AvatarSize = 'sm' | 'default' | 'lg';

interface AvatarProps extends React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Root
> {
  size?: AvatarSize;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size = 'default', ...props }, ref) => {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      data-slot="avatar"
      data-size={size}
      className={cn(
        [
          'group/avatar',
          'relative',
          'flex shrink-0 overflow-hidden',
          'rounded-full',
          'select-none',

          'ring-border/60 ring-1',
          'shadow-sm',

          'transition-all duration-200',

          'data-[size=sm]:size-6',
          'data-[size=default]:size-8',
          'data-[size=lg]:size-10',
        ],
        className,
      )}
      {...props}
    />
  );
});

Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      data-slot="avatar-image"
      className={cn(
        [
          'aspect-square',
          'size-full',
          'object-cover',
          'transition-opacity duration-300',
        ],
        className,
      )}
      {...props}
    />
  );
});

AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      data-slot="avatar-fallback"
      className={cn(
        [
          'flex size-full items-center justify-center',
          'rounded-full',

          'bg-muted',
          'font-medium',
          'text-muted-foreground',

          'group-data-[size=sm]/avatar:text-[10px]',
          'group-data-[size=default]/avatar:text-xs',
          'group-data-[size=lg]/avatar:text-sm',
        ],
        className,
      )}
      {...props}
    />
  );
});

AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

type AvatarBadgeVariant = 'online' | 'offline' | 'busy' | 'away';

interface AvatarBadgeProps extends React.ComponentPropsWithoutRef<'span'> {
  variant?: AvatarBadgeVariant;
}

function AvatarBadge({
  className,
  variant = 'online',
  ...props
}: AvatarBadgeProps) {
  return (
    <span
      data-slot="avatar-badge"
      data-variant={variant}
      className={cn(
        [
          'absolute right-0 bottom-0 z-10',
          'rounded-full',
          'ring-background ring-2',

          'group-data-[size=sm]/avatar:size-2',
          'group-data-[size=default]/avatar:size-2.5',
          'group-data-[size=lg]/avatar:size-3',

          'data-[variant=online]:bg-emerald-500',
          'data-[variant=offline]:bg-zinc-400',
          'data-[variant=busy]:bg-red-500',
          'data-[variant=away]:bg-amber-500',
        ],
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        [
          'group/avatar-group',
          'flex',
          '-space-x-3',

          '*:data-[slot=avatar]:ring-2',
          '*:data-[slot=avatar]:ring-background',

          '*:data-[slot=avatar]:transition-transform',
          '*:data-[slot=avatar]:duration-200',

          'hover:*:data-[slot=avatar]:-translate-y-px',
        ],
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        [
          'relative',
          'flex shrink-0 items-center justify-center',

          'rounded-full',

          'bg-muted',
          'font-medium',
          'text-muted-foreground',

          'ring-background ring-2',

          'size-8',
          'group-has-data-[size=sm]/avatar-group:size-6',
          'group-has-data-[size=lg]/avatar-group:size-10',
        ],
        className,
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
};

import * as React from 'react';

import { cn } from '@/lib/utils';

type CardSize = 'default' | 'sm';

interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  size?: CardSize;
  interactive?: boolean;
}

function Card({
  className,
  size = 'default',
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-interactive={interactive}
      className={cn(
        [
          'group/card',
          'relative',

          'flex flex-col',

          'overflow-hidden',

          'rounded-2xl',

          'border-border/60 border',

          'bg-card',

          'text-card-foreground',

          'shadow-sm',

          'transition-all duration-200',

          'data-[size=default]:p-6',
          'data-[size=sm]:p-4',

          'data-[interactive=true]:cursor-pointer',
          'data-[interactive=true]:hover:border-border',
          'data-[interactive=true]:hover:shadow-md',
          'data-[interactive=true]:hover:-translate-y-0.5',
        ],
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        [
          'grid',
          'gap-1.5',

          'pb-4',

          'has-[>[data-slot=card-action]]:grid-cols-[1fr_auto]',
        ],
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        ['text-base', 'font-semibold', 'tracking-tight', 'leading-none'],
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        ['text-sm', 'leading-relaxed', 'text-muted-foreground'],
        className,
      )}
      {...props}
    />
  );
}

function CardAction({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        ['col-start-2', 'row-span-2', 'self-start', 'justify-self-end'],
        className,
      )}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn(['flex-1'], className)}
      {...props}
    />
  );
}

function CardFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        ['mt-6', 'flex items-center', 'border-t', 'pt-4'],
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
};

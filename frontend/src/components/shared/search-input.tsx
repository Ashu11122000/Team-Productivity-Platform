'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchInputProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  'onChange'
> {
  value: string;

  onChange: (value: string) => void;

  debounceMs?: number;

  showClearButton?: boolean;

  containerClassName?: string;
}

function SearchInput({
  value,
  onChange,
  debounceMs = 300,
  showClearButton = true,
  placeholder = 'Search...',
  className,
  containerClassName,
  ...props
}: SearchInputProps) {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLocalValue(value);
    }, 0);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [value]);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [localValue, value, debounceMs, onChange]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={cn('relative w-full', containerClassName)}>
      <Search
        aria-hidden="true"
        className={cn([
          'absolute top-1/2 left-3',

          'size-4',

          '-translate-y-1/2',

          'text-muted-foreground',
        ])}
      />

      <Input
        value={localValue}
        placeholder={placeholder}
        className={cn(
          'pl-9',
          showClearButton && localValue.length > 0 && 'pr-10',
          className,
        )}
        onChange={(event) => setLocalValue(event.target.value)}
        {...props}
      />

      {showClearButton && localValue.length > 0 && (
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Clear search"
          className={cn([
            'absolute top-1/2 right-1',

            '-translate-y-1/2',

            'h-7 w-7',
          ])}
          onClick={handleClear}
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  );
}

export { SearchInput };

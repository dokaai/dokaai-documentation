'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';
import type { SegmentedControlProps } from './segmented-control.types';

/** Native radio inputs provide form submission, focus, and arrow-key navigation. */
export function SegmentedControl({
  items, label, value, defaultValue, onValueChange, name, disabled,
  size = 'md', variant = 'primary', fullWidth = false, className,
}: SegmentedControlProps) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(() => defaultValue ?? items.find((item) => !item.disabled)?.value);
  const selected = value ?? internalValue;

  return (
    <fieldset
      disabled={disabled}
      className={cn('not-prose m-0 min-w-0 rounded-lg border border-fd-border bg-fd-muted/50 p-1', fullWidth ? 'w-full' : 'w-fit max-w-full', disabled ? 'opacity-50' : undefined, className)}
    >
      <legend className="sr-only">{label}</legend>
      <div className="flex gap-1 overflow-x-auto p-0.5">
        {items.map((item) => (
          <label key={item.value} className={cn('relative flex shrink-0', fullWidth ? 'flex-1' : undefined)}>
            <input
              type="radio"
              className="peer sr-only"
              name={name ?? id}
              value={item.value}
              checked={selected === item.value}
              disabled={item.disabled}
              onChange={() => {
                if (value === undefined) setInternalValue(item.value);
                onValueChange?.(item.value);
              }}
            />
            <span className={cn(
              'inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent peer-focus-visible:ring-2 peer-focus-visible:ring-fd-ring peer-disabled:pointer-events-none peer-disabled:opacity-50',
              size === 'sm' ? 'h-7 px-2 text-xs' : 'h-8 px-3 text-sm',
              variant === 'primary' ? 'peer-checked:bg-fd-primary peer-checked:text-fd-primary-foreground peer-checked:hover:bg-fd-primary/90' : 'peer-checked:bg-fd-background peer-checked:text-fd-foreground peer-checked:shadow-sm peer-checked:hover:bg-fd-accent',
            )}>
              {item.label}
              {item.count !== undefined && <span className="rounded-full bg-fd-background/20 px-1.5 text-xs tabular-nums">{item.count}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

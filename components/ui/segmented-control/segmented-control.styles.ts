import { cn } from '@/lib/cn';
import type { SegmentedControlProps } from './segmented-control.types';

type StyleProps = Pick<SegmentedControlProps, 'size' | 'variant' | 'fullWidth' | 'disabled' | 'className'>;

const sizes = {
  sm: 'h-7 px-2 text-xs',
  md: 'h-8 px-3 text-sm',
};

const variants = {
  primary: 'peer-checked:bg-fd-primary peer-checked:text-fd-primary-foreground peer-checked:hover:bg-fd-primary/90',
  surface: 'peer-checked:bg-fd-background peer-checked:text-fd-foreground peer-checked:shadow-sm peer-checked:hover:bg-fd-accent',
};

export function segmentedControlStyles({ size = 'md', variant = 'primary', fullWidth = false, disabled, className }: StyleProps = {}) {
  return {
    root: cn(
      'not-prose m-0 min-w-0 rounded-lg border border-fd-border bg-fd-muted/50 p-1',
      fullWidth ? 'w-full' : 'w-fit max-w-full',
      disabled ? 'opacity-50' : undefined,
      className,
    ),
    legend: 'sr-only',
    list: 'flex gap-1 overflow-x-auto p-0.5',
    item: cn('relative flex shrink-0', fullWidth ? 'flex-1' : undefined),
    input: 'peer sr-only',
    option: cn(
      'inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent peer-focus-visible:ring-2 peer-focus-visible:ring-fd-ring peer-disabled:pointer-events-none peer-disabled:opacity-50',
      sizes[size],
      variants[variant],
    ),
    count: 'rounded-full bg-fd-background/20 px-1.5 text-xs tabular-nums',
  };
}

import { cn } from '@/lib/cn';

export function cardStyles({ linked, className }: { linked?: boolean; className?: string } = {}) {
  return cn(
    'not-prose rounded-xl border-fd-border p-5 shadow-sm',
    linked ? 'hover:border-fd-primary/40 hover:bg-fd-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-offset-2' : undefined,
    className,
  );
}

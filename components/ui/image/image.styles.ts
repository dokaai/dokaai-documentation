import { cn } from '@/lib/cn';
import type { ImageProps } from './image.types';

export function imageStyles({ className, figureClassName }: Pick<ImageProps, 'className' | 'figureClassName'> = {}) {
  return {
    image: cn('h-auto max-w-full rounded-xl border border-fd-border bg-fd-muted/30 shadow-sm', className),
    figure: cn('not-prose my-6 min-w-0', figureClassName),
    caption: 'mt-3 text-center text-sm leading-relaxed text-fd-muted-foreground',
  };
}

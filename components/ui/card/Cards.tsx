import { Cards as FumadocsCards } from 'fumadocs-ui/components/card';
import { cn } from '@/lib/cn';
import type { CardsProps } from './card.types';

export function Cards({ className, ...props }: CardsProps) {
  return <FumadocsCards {...props} className={cn('not-prose my-4 grid-cols-1 gap-4 sm:grid-cols-2', className)} />;
}

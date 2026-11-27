import { Card as FumadocsCard } from 'fumadocs-ui/components/card';
import { cn } from '@/lib/cn';
import type { CardProps } from './card.types';

export function Card({ className, href, ...props }: CardProps) {
  return (
    <FumadocsCard
      {...props}
      href={href}
      className={cn(
        'not-prose rounded-xl border-fd-border p-5 shadow-sm',
        href ? 'hover:border-fd-primary/40 hover:bg-fd-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-offset-2' : undefined,
        className,
      )}
    />
  );
}

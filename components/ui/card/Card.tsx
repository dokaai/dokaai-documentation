import { Card as FumadocsCard } from 'fumadocs-ui/components/card';
import { cardStyles } from './card.styles';
import type { ComponentProps } from 'react';

export type CardProps = ComponentProps<typeof FumadocsCard>;

export function Card({ className, href, ...props }: CardProps) {
  return (
    <FumadocsCard
      {...props}
      href={href}
      className={cardStyles({ linked: Boolean(href), className })}
    />
  );
}

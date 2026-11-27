import Link from 'next/link';
import { buttonStyles } from './button.styles';
import type { ButtonLinkProps } from './button.types';

export function ButtonLink({ variant, size, className, target, rel, ...props }: ButtonLinkProps) {
  return (
    <Link
      {...props}
      target={target}
      rel={target === '_blank' ? [...new Set(`${rel ?? ''} noopener noreferrer`.trim().split(/\s+/))].join(' ') : rel}
      className={buttonStyles({ variant, size, className })}
    />
  );
}

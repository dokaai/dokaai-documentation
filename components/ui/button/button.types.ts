import type { ComponentProps } from 'react';
import type Link from 'next/link';

export interface ButtonStyleProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
}

export type ButtonProps = ComponentProps<'button'> & ButtonStyleProps & { loading?: boolean };
export type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyleProps;

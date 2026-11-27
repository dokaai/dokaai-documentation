import { cn } from '@/lib/cn';
import type { ButtonStyleProps } from './button.types';

export const buttonLoadingIconStyles = 'animate-spin motion-reduce:animate-none';

const variants = {
  primary: 'border-transparent bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90',
  secondary: 'border-transparent bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent',
  outline: 'border-fd-border bg-transparent text-fd-foreground hover:border-fd-primary hover:bg-fd-primary/5',
  ghost: 'border-transparent bg-transparent text-fd-foreground hover:bg-fd-accent',
};

const sizes = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-12 gap-2 px-6 text-base',
  icon: 'size-10 p-0',
};

export function buttonStyles({ variant = 'primary', size = 'md', className }: ButtonStyleProps = {}) {
  return cn(
    'not-prose inline-flex shrink-0 items-center justify-center rounded-md border font-medium no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-offset-2 focus-visible:ring-offset-fd-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
    variants[variant],
    sizes[size],
    className,
  );
}

import { LoaderCircle } from 'lucide-react';
import { buttonStyles } from './button.styles';
import type { ButtonProps } from './button.types';

export function Button({
  variant, size, className, type = 'button', disabled, loading = false, children, ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, className })}
    >
      {loading && <LoaderCircle className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
      {children}
    </button>
  );
}

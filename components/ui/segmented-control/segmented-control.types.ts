import type { ReactNode } from 'react';

export interface SegmentedControlItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  count?: number | string;
}

export interface SegmentedControlProps {
  items: readonly SegmentedControlItem[];
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'surface';
  fullWidth?: boolean;
  className?: string;
}

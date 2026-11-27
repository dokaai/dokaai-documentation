import type { ImageProps as NextImageProps } from 'next/image';
import type { ReactNode } from 'react';

export interface ImageProps extends Omit<NextImageProps, 'alt' | 'width' | 'height' | 'fill' | 'children'> {
  alt: string;
  width: number;
  height: number;
  caption?: ReactNode;
  zoom?: boolean;
  figureClassName?: string;
}

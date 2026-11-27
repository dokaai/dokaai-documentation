import NextImage from 'next/image';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { cn } from '@/lib/cn';
import type { ImageProps } from './image.types';

export function Image({
  alt, width, height, caption, zoom = true, className, figureClassName,
  sizes = '(max-width: 768px) 100vw, 900px', ...props
}: ImageProps) {
  const image = (
    <NextImage
      {...props}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={cn('h-auto max-w-full rounded-xl border border-fd-border bg-fd-muted/30 shadow-sm', className)}
    />
  );

  return (
    <figure className={cn('not-prose my-6 min-w-0', figureClassName)}>
      {zoom ? (
        <ImageZoom src={props.src} alt={alt} width={width} height={height}>
          {image}
        </ImageZoom>
      ) : image}
      {caption && <figcaption className="mt-3 text-center text-sm leading-relaxed text-fd-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

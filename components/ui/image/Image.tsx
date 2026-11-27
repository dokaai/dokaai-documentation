import NextImage from 'next/image';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { imageStyles } from './image.styles';
import type { ImageProps } from './image.types';

export function Image({
  alt, width, height, caption, zoom = true, className, figureClassName,
  sizes = '(max-width: 768px) 100vw, 900px', ...props
}: ImageProps) {
  const styles = imageStyles({ className, figureClassName });
  const image = (
    <NextImage
      {...props}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={styles.image}
    />
  );

  return (
    <figure className={styles.figure}>
      {zoom ? (
        <ImageZoom src={props.src} alt={alt} width={width} height={height}>
          {image}
        </ImageZoom>
      ) : image}
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}

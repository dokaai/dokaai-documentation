import type { MetadataRoute } from 'next';
import { getMetadataBase } from '@/lib/metadata';
import { withBasePath } from '@/lib/shared';

export default function robots(): MetadataRoute.Robots {
  const metadataBase = getMetadataBase();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: new URL(withBasePath('/sitemap.xml'), metadataBase).toString(),
  };
}

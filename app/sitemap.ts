import { statSync } from 'node:fs';
import { join } from 'node:path';
import type { MetadataRoute } from 'next';
import { providerGuideSource, source } from '@/lib/source';
import { getMetadataBase } from '@/lib/metadata';
import { withBasePath } from '@/lib/shared';

export default function sitemap(): MetadataRoute.Sitemap {
  const metadataBase = getMetadataBase();
  const sitemapEntries = new Map<string, Date>([['/', getContentLastModified('index.mdx')]]);

  for (const page of source.getPages()) {
    sitemapEntries.set(page.url, getContentLastModified(page.path));
  }

  for (const page of providerGuideSource.getPages()) {
    sitemapEntries.set(page.url, getContentLastModified(page.path, 'provider-guides'));
  }

  return Array.from(sitemapEntries.entries()).map(([url, lastModified]) => ({
    url: new URL(withBasePath(url), metadataBase).toString(),
    lastModified,
  }));
}

function getContentLastModified(contentPath: string, directory = 'content') {
  return statSync(join(process.cwd(), directory, contentPath)).mtime;
}

import { getPageImage, providerGuideSource, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { appName } from '@/lib/shared';
import { getProviderMetadata } from '@/lib/integrations/provider-metadata';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/[...slug]'>) {
  const { slug } = await params;
  const pageSlug = slug.slice(0, -1);
  const page = source.getPage(pageSlug);
  const provider = !page && pageSlug.length === 3 &&
    pageSlug[0] === 'integration' && pageSlug[1] === 'providers'
    ? await getProviderMetadata(pageSlug[2])
    : null;
  if (!page && !provider) notFound();

  return new ImageResponse(
    <DefaultImage
      title={provider?.title ?? page!.data.title}
      description={provider?.description ?? page!.data.description}
      site={appName}
    />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return [...source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  })), ...providerGuideSource.getPages().map((page) => ({
    slug: ['integration', 'providers', ...page.slugs, 'image.png'],
  }))];
}

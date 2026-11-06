import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';
import { getProviderCatalog, getProviderDetail } from '@/lib/integrations/provider-catalog';
import { ProviderDetail } from '@/components/integrations/provider-detail';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { IntegrationPageSkeleton } from '@/components/integrations/integration-loading';

type PageParams = {
  slug?: string[];
};

export default async function Page(props: { params: Promise<PageParams> }) {
  const params = await props.params;
  const slug = params.slug ?? [];
  if (slug[0] === 'integration') await connection();
  const page = source.getPage(slug);
  if (
    !page &&
    slug.length === 3 &&
    slug[0] === 'integration' &&
    slug[1] === 'providers'
  ) {
    return (
      <Suspense fallback={<IntegrationPageSkeleton detail />}>
        <ProviderPage providerId={slug[2]} />
      </Suspense>
    );
  }
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const isApiReferencePage = page.url.startsWith('/api-reference');

  return (
    <DocsPage
      toc={page.data.toc}
      full={isApiReferencePage ? true : page.data.full}
      className={isApiReferencePage ? 'dokaai-api-page' : undefined}
      tableOfContent={{ enabled: !isApiReferencePage, style: 'clerk' }}
      tableOfContentPopover={{ enabled: !isApiReferencePage, style: 'clerk' }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

async function ProviderPage({ providerId }: { providerId: string }) {
  const providers = await getProviderCatalog();
  if (!providers)
    return (
      <DocsPage>
        <DocsTitle>Providers temporarily unavailable</DocsTitle>
        <DocsBody>Please try again later.</DocsBody>
      </DocsPage>
    );
  const provider = providers.find((item) => item.providerId === providerId);
  if (!provider) notFound();
  const detail = await getProviderDetail(provider.providerId);
  return (
    <ProviderDetail
      provider={{ ...provider, credentialSchema: detail?.credentialSchema }}
      detailUnavailable={!detail}
    />
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug ?? [];
  const page = source.getPage(slug);
  if (
    !page &&
    slug.length === 3 &&
    slug[0] === 'integration' &&
    slug[1] === 'providers'
  ) {
    const providers = await getProviderCatalog();
    const provider = providers?.find((item) => item.providerId === slug[2]);
    return { title: provider?.name ?? 'Provider integration' };
  }
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}

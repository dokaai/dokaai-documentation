import DocsPageRenderer, { generateDocsMetadata } from '@/components/docs-page-renderer';
import { source } from '@/lib/source';

type IntegrationPageProps = {
  params: Promise<{ slug?: string[] }>;
};

function documentationParams(params: IntegrationPageProps['params']) {
  return params.then(({ slug = [] }) => ({ slug: ['integration', ...slug] }));
}

export default function IntegrationPage({ params }: IntegrationPageProps) {
  return <DocsPageRenderer params={documentationParams(params)} />;
}

export function generateMetadata({ params }: IntegrationPageProps) {
  return generateDocsMetadata({ params: documentationParams(params) });
}

export function generateStaticParams() {
  return source.generateParams()
    .filter((page) => page.slug?.[0] === 'integration')
    .map((page) => ({ ...page, slug: page.slug.slice(1) }));
}

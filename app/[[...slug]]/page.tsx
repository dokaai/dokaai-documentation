import { source } from '@/lib/source';

export { default, generateDocsMetadata as generateMetadata } from '@/components/docs-page-renderer';

export function generateStaticParams() {
  return source.generateParams().filter((page) => page.slug?.[0] !== 'integration');
}

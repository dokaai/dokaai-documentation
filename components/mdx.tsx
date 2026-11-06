import defaultMdxComponents from 'fumadocs-ui/mdx';
import { APIPage } from '@/components/api-page';
import { ProviderCatalog } from '@/components/integrations/provider-catalog';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    APIPage,
    ProviderCatalog,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

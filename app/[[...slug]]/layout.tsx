import {
  ApiSidebarFolder,
  ApiSidebarSearch,
} from '@/components/api-sidebar-folder';
import { source } from '@/lib/source';
import { DocsFooter } from '@/components/docs-footer';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { docsTabs } from '@/lib/docs-tabs';
import { getDocsOnlyPageTree } from '@/lib/page-tree';
import { type ReactNode } from 'react';
import { connection } from 'next/server';
import { getProviderCatalog } from '@/lib/integrations/provider-catalog';
import { IntegrationLayout } from '@/components/integrations/integration-layout';

type LayoutParams = {
  slug?: string[];
};

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<LayoutParams>;
}) {
  const resolvedParams = await params;
  const pageTree = source.getPageTree();
  const isApiReferencePage = resolvedParams.slug?.[0] === 'api-reference';
  const isIntegrationPage = resolvedParams.slug?.[0] === 'integration';
  const isDocumentationPage = !isApiReferencePage && !isIntegrationPage;
  const { nav, ...base } = baseOptions();
  const layoutProps = {
    ...base,
    tree: isDocumentationPage ? getDocsOnlyPageTree(pageTree) : pageTree,
    tabs: docsTabs,
    tabMode: 'navbar' as const,
    nav: { ...nav, mode: 'top' as const },
  };

  return (
    <>
      {isIntegrationPage ? (
        <IntegrationLayout {...layoutProps} catalog={loadIntegrationCatalog()}>
          {children}
        </IntegrationLayout>
      ) : (
        <DocsLayout
          {...layoutProps}
          sidebar={isApiReferencePage ? {
            banner: ApiSidebarSearch,
            components: { Folder: ApiSidebarFolder },
          } : undefined}
        >
          {children}
        </DocsLayout>
      )}
      <div className="border-t bg-[#fafafa] px-8 pb-8 pt-10 md:px-10 xl:px-12">
        <DocsFooter />
      </div>
    </>
  );
}

async function loadIntegrationCatalog() {
  await connection();
  return getProviderCatalog();
}

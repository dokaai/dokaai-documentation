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
import { Suspense, type ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import {
  IntegrationPageSkeleton,
  IntegrationSidebarSkeleton,
} from '@/components/integrations/integration-loading';
import { connection } from 'next/server';
import { getProviderCatalog } from '@/lib/integrations/provider-catalog';
import { getIntegrationPageTree } from '@/lib/integrations/integration-tree';

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
  if (isIntegrationPage) {
    return (
      <Suspense
        fallback={
          <IntegrationLayoutFallback
            detail={resolvedParams.slug?.[1] === 'providers'}
          />
        }
      >
        <IntegrationLayout pageTree={pageTree}>{children}</IntegrationLayout>
      </Suspense>
    );
  }
  const { nav, ...base } = baseOptions();

  return (
    <>
      <DocsLayout
        {...base}
        tree={isDocumentationPage ? getDocsOnlyPageTree(pageTree) : pageTree}
        sidebar={
          isApiReferencePage
            ? {
                banner: ApiSidebarSearch,
                components: {
                  Folder: ApiSidebarFolder,
                },
              }
            : undefined
        }
        tabs={docsTabs}
        tabMode="navbar"
        nav={{ ...nav, mode: 'top' }}
      >
        {children}
      </DocsLayout>
      <div className="border-t bg-[#fafafa] px-8 pb-8 pt-10 md:px-10 xl:px-12">
        <DocsFooter />
      </div>
    </>
  );
}

async function IntegrationLayout({
  children,
  pageTree,
}: {
  children: ReactNode;
  pageTree: PageTree.Root;
}) {
  await connection();
  const tree = getIntegrationPageTree(pageTree, await getProviderCatalog());
  const { nav, ...base } = baseOptions();
  return (
    <>
      <DocsLayout
        {...base}
        tree={tree}
        tabs={docsTabs}
        tabMode="navbar"
        nav={{ ...nav, mode: 'top' }}
      >
        {children}
      </DocsLayout>
      <div className="border-t bg-[#fafafa] px-8 pb-8 pt-10 md:px-10 xl:px-12">
        <DocsFooter />
      </div>
    </>
  );
}

function IntegrationLayoutFallback({ detail }: { detail: boolean }) {
  const { nav, ...base } = baseOptions();
  const tree: PageTree.Root = {
    name: 'Integrations',
    children: [
      { type: 'page', name: 'Overview', url: '/integration' },
      { type: 'separator', name: <IntegrationSidebarSkeleton /> },
    ],
  };
  return (
    <DocsLayout
      {...base}
      tree={tree}
      tabs={docsTabs}
      tabMode="navbar"
      nav={{ ...nav, mode: 'top' }}
    >
      <IntegrationPageSkeleton detail={detail} />
    </DocsLayout>
  );
}

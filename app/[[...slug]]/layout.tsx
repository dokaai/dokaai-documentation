import {
  ApiSidebarFolder,
  ApiSidebarSearch,
} from '@/components/api-sidebar-folder';
import { source } from '@/lib/source';
import { DocsFooter } from '@/components/docs-footer';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { getDocsTabs } from '@/lib/docs-tabs';
import { getDocsOnlyPageTree } from '@/lib/page-tree';
import type { ReactNode } from 'react';

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
  const isFeaturesPage = resolvedParams.slug?.[0] === 'features';
  const isDocumentationPage = !isApiReferencePage && !isFeaturesPage;
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
        tabs={getDocsTabs(pageTree, source.getPages())}
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

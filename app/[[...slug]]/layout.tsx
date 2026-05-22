import { ApiSidebarFolder } from '@/components/api-sidebar-folder';
import { source } from '@/lib/source';
import { DocsFooter } from '@/components/docs-footer';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { docsTabs } from '@/lib/docs-tabs';
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
  const isApiReferencePage = resolvedParams.slug?.[0] === 'api-reference';
  const { nav, ...base } = baseOptions();

  return (
    <>
      <DocsLayout
        {...base}
        tree={source.getPageTree()}
        sidebar={
          isApiReferencePage
            ? {
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

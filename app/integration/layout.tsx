import type { ReactNode } from 'react';
import { connection } from 'next/server';
import { DocsFooter } from '@/components/docs-footer';
import { IntegrationLayout } from '@/components/integrations/integration-layout';
import { getDocsTabs } from '@/lib/docs-tabs';
import { getProviderCatalog } from '@/lib/integrations/provider-catalog';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

// Keep navigation mounted between provider pages while live data loads independently.
export default function Layout({ children }: { children: ReactNode }) {
  const { nav, ...base } = baseOptions();
  const tree = source.getPageTree();
  return (
    <>
      <IntegrationLayout
        {...base}
        tree={tree}
        catalog={loadIntegrationCatalog()}
        tabs={getDocsTabs(tree, source.getPages())}
        tabMode="navbar"
        nav={{ ...nav, mode: 'top' }}
      >
        {children}
      </IntegrationLayout>
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

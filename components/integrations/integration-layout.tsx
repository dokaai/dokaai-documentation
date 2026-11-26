'use client';

import { createContext, Suspense, use, type ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { TreeContextProvider } from 'fumadocs-ui/contexts/tree';
import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/notebook';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarCollapseTrigger,
  useSidebar,
  type SidebarProps,
} from 'fumadocs-ui/layouts/notebook/slots/sidebar';
import type { Provider } from '@/lib/integrations/provider-catalog';
import { getIntegrationPageTree } from '@/lib/integrations/integration-tree';
import { IntegrationSidebarSkeleton } from './integration-loading';

type Navigation = { tree: PageTree.Root; catalog: Promise<Provider[] | null> };
const NavigationContext = createContext<Navigation | null>(null);

function LiveSidebar(props: SidebarProps) {
  const { tree, catalog } = use(NavigationContext)!;
  const providers = use(catalog);
  return (
    <TreeContextProvider tree={getIntegrationPageTree(tree, providers)}>
      <Sidebar
        {...props}
        footer={providers === null
          ? <p role="status">Provider navigation is temporarily unavailable.</p>
          : props.footer}
      />
    </TreeContextProvider>
  );
}

function IntegrationSidebar(props: SidebarProps) {
  return (
    <Suspense fallback={<Sidebar {...props} footer={<IntegrationSidebarSkeleton />} />}>
      <LiveSidebar {...props} />
    </Suspense>
  );
}

/** Only the sidebar's live navigation waits for the catalog. */
export function IntegrationLayout({
  catalog,
  tree,
  children,
  ...props
}: Omit<DocsLayoutProps, 'tree'> & Navigation & { children: ReactNode }) {
  return (
    <NavigationContext value={{ tree, catalog }}>
      <DocsLayout
        {...props}
        tree={getIntegrationPageTree(tree, [])}
        slots={{ sidebar: {
          provider: SidebarProvider,
          root: IntegrationSidebar,
          trigger: SidebarTrigger,
          collapseTrigger: SidebarCollapseTrigger,
          useSidebar,
        } }}
      >
        {children}
      </DocsLayout>
    </NavigationContext>
  );
}

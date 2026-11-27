import { BookOpen, Code, Layers, Plug } from 'lucide-react';
import type { LayoutTab } from 'fumadocs-ui/layouts/shared';
import type * as PageTree from 'fumadocs-core/page-tree';
import { getDocsOnlyPageTree } from './page-tree';

export const docsTabs: LayoutTab[] = [
  {
    title: 'Documentation',
    description: 'Product docs',
    url: '/',
    icon: <BookOpen className="size-4" />,
  },
  {
    title: 'Features',
    description: 'Product features',
    url: '/features',
    icon: <Layers className="size-4" />,
  },
  {
    title: 'Integration',
    description: 'Integration guides',
    url: '/integration',
    icon: <Plug className="size-4" />,
  },
  {
    title: 'API Reference',
    description: 'Endpoint reference',
    url: '/api-reference',
    icon: <Code className="size-4" />,
  },
] satisfies LayoutTab[];

export function getDocsTabs(
  tree: PageTree.Root,
  pages: readonly { url: string }[] = [],
): LayoutTab[] {
  const urls = new Set<string>();

  function collect(nodes: PageTree.Node[]) {
    for (const node of nodes) {
      if (node.type === 'page') urls.add(node.url);
      if (node.type === 'folder') {
        if (node.index) urls.add(node.index.url);
        collect(node.children);
      }
    }
  }

  collect(getDocsOnlyPageTree(tree).children);
  for (const { url } of pages) {
    const belongsToAnotherTab = docsTabs.some((tab) =>
      tab.url !== '/' && (url === tab.url || url.startsWith(`${tab.url}/`)),
    );
    if (!belongsToAnotherTab) urls.add(url);
  }
  return docsTabs.map((tab) => tab.url === '/' ? { ...tab, urls } : tab);
}

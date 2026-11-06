import type * as PageTree from 'fumadocs-core/page-tree';
import type { Provider } from './provider-catalog';
import { channelLabel, providerUrl } from './provider-content';

export function getIntegrationPageTree(
  tree: PageTree.Root,
  providers: Provider[] | null,
): PageTree.Root {
  const groups = new Map<string, Provider[]>();
  for (const provider of providers ?? []) {
    const group = groups.get(provider.channel) ?? [];
    group.push(provider);
    groups.set(provider.channel, group);
  }
  const children: PageTree.Node[] = [
    { type: 'page', name: 'Overview', url: '/integration' },
    ...[...groups.entries()]
      .sort(([a], [b]) => channelLabel(a).localeCompare(channelLabel(b)))
      .map(
        ([channel, entries]): PageTree.Folder => ({
          type: 'folder',
          name: channelLabel(channel),
          defaultOpen: false,
          children: entries
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((provider) => ({
              type: 'page',
              name: provider.name,
              url: providerUrl(provider.providerId),
            })),
        }),
      ),
  ];
  return {
    ...tree,
    // Fumadocs memoizes trees by $id, so distinguish this generated tree from
    // the regular docs tree and refresh it when the catalog changes.
    $id: `integration:${JSON.stringify(children)}`,
    children: tree.children.map((node) => {
      if (node.type !== 'folder') return node;
      const overview = node.children.find(
        (child) => child.type === 'page' && child.url === '/integration',
      );
      if (!overview && node.index?.url !== '/integration') return node;
      return {
        ...node,
        children: [
          overview ?? children[0],
          ...children.slice(1),
          ...node.children.filter((child) => child !== overview),
        ],
      };
    }),
  };
}

import type { ReactNode } from 'react';

type PageTreeNode =
  | {
      type: 'separator';
      name?: ReactNode;
    }
  | {
      type: 'page';
      name: ReactNode;
      url: string;
    }
  | {
      type: 'folder';
      name: ReactNode;
      index?: {
        url: string;
      };
    };

type PageTreeRoot = {
  children: PageTreeNode[];
};

const topLevelDocsHiddenUrls = new Set(['/integration', '/api-reference']);
const topLevelDocsHiddenNames = new Set(['Reference', 'Integration', 'API Reference']);

function shouldKeepDocsSidebarNode(node: PageTreeNode) {
  if (node.type === 'separator') {
    return typeof node.name !== 'string' || !topLevelDocsHiddenNames.has(node.name);
  }

  if (typeof node.name === 'string' && topLevelDocsHiddenNames.has(node.name)) {
    return false;
  }

  if ('url' in node && topLevelDocsHiddenUrls.has(node.url)) {
    return false;
  }

  if ('index' in node && node.index && topLevelDocsHiddenUrls.has(node.index.url)) {
    return false;
  }

  return true;
}

export function getDocsOnlyPageTree<T extends PageTreeRoot>(tree: T): T {
  return {
    ...tree,
    children: tree.children.filter(shouldKeepDocsSidebarNode),
  } as T;
}

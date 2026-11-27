import { createElement, type ReactNode } from 'react';
import { CodeXml } from 'lucide-react';

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

const topLevelDocsHiddenUrls = new Set(['/features', '/integration', '/api-reference']);
const topLevelDocsHiddenNames = new Set(['Reference', 'Features', 'Integration', 'API Reference']);

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
    children: tree.children.filter(shouldKeepDocsSidebarNode).map((node) => {
      if (node.type !== 'folder' || node.name !== 'In-App Inbox') return node;

      return {
        ...node,
        name: createElement(
          'span',
          {
            key: 'in-app-inbox-label',
            className: 'flex min-w-0 flex-1 items-center gap-2',
          },
          node.name,
          createElement(CodeXml, {
            'aria-hidden': true,
            className: 'size-4 shrink-0 text-fd-muted-foreground',
          }),
        ),
      };
    }),
  } as T;
}

import assert from 'node:assert/strict';
import test from 'node:test';
import type * as PageTree from 'fumadocs-core/page-tree';
import { isLayoutTabActive } from 'fumadocs-ui/layouts/shared';
import { docsTabs, getDocsTabs } from './docs-tabs';

const tree: PageTree.Root = {
  name: 'Documentation',
  children: [
    { type: 'page', name: 'Home', url: '/' },
    { type: 'page', name: 'Quickstart', url: '/quickstart' },
    {
      type: 'folder', name: 'Build notifications',
      index: { type: 'page', name: 'Build', url: '/build' },
      children: [
        { type: 'page', name: 'Variables', url: '/build/variables' },
        {
          type: 'folder', name: 'Future topics',
          children: [{ type: 'page', name: 'New topic', url: '/build/future/topic' }],
        },
      ],
    },
    {
      type: 'folder', name: 'Features', root: true,
      children: [
        { type: 'page', name: 'Overview', url: '/features' },
        {
          type: 'folder', name: 'Inbox',
          children: [{ type: 'page', name: 'React example', url: '/features/in-app-inbox/react' }],
        },
      ],
    },
    {
      type: 'folder', name: 'Integration', root: true,
      children: [{ type: 'page', name: 'Overview', url: '/integration' }],
    },
    {
      type: 'folder', name: 'API Reference', root: true,
      children: [{ type: 'page', name: 'Overview', url: '/api-reference' }],
    },
  ],
};

test('Documentation stays active for every depth in its page tree', () => {
  for (const pathname of ['/', '/quickstart', '/build', '/build/variables', '/build/variables/', '/build/future/topic']) {
    assert.deepEqual(activeTabs(pathname), ['Documentation'], pathname);
  }
});

function activeTabs(pathname: string) {
  return getDocsTabs(tree)
    .filter((tab) => isLayoutTabActive(tab, pathname))
    .map((tab) => tab.title);
}

test('Integration and API Reference keep their existing active states', () => {
  const tabs = getDocsTabs(tree);
  for (const pathname of ['/integration', '/integration/providers/example']) {
    assert.deepEqual(activeTabs(pathname), ['Integration'], pathname);
  }
  for (const pathname of ['/api-reference', '/api-reference/notification-handlers/trigger-notification-handler']) {
    assert.deepEqual(activeTabs(pathname), ['API Reference'], pathname);
  }
  for (const url of ['/features', '/integration', '/api-reference']) {
    assert.equal(tabs.find((tab) => tab.url === url), docsTabs.find((tab) => tab.url === url));
  }
  assert.equal(docsTabs[0].urls, undefined);
});

test('Features owns its root and nested pages without selecting Documentation', () => {
  for (const pathname of ['/features', '/features/', '/features/in-app-inbox', '/features/in-app-inbox/react']) {
    assert.deepEqual(activeTabs(pathname), ['Features'], pathname);
  }
});

test('Documentation stays active on retained pages hidden from its sidebar', () => {
  const pages = [
    { url: '/account/api-credentials' },
    { url: '/troubleshooting/delivery' },
    { url: '/features/in-app-inbox/setup' },
    { url: '/integration/providers/example' },
    { url: '/api-reference/authentication' },
  ];
  const tabs = getDocsTabs(tree, pages);
  for (const { url } of pages) {
    const expected = url.startsWith('/features/') ? 'Features'
      : url.startsWith('/integration/') ? 'Integration'
      : url.startsWith('/api-reference/') ? 'API Reference' : 'Documentation';
    assert.deepEqual(
      tabs.filter((tab) => isLayoutTabActive(tab, url)).map((tab) => tab.title),
      [expected],
      url,
    );
  }
});

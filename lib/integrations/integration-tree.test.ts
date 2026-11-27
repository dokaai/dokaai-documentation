import assert from 'node:assert/strict';
import test from 'node:test';
import type * as PageTree from 'fumadocs-core/page-tree';
import { searchPath } from 'fumadocs-core/breadcrumb';
import type { Provider } from './provider-catalog';
import { getIntegrationPageTree } from './integration-tree';

const providers: Provider[] = [
  { id: '1', providerId: 'email-provider', name: 'Email provider', channel: 'email', status: 'active' },
  { id: '2', providerId: 'sms-provider', name: 'SMS provider', channel: 'sms', status: 'active' },
  { id: '3', providerId: 'push-provider', name: 'Push provider', channel: 'push', status: 'active' },
  { id: '4', providerId: 'whatsApp', name: 'WhatsApp provider', channel: 'whatsApp', status: 'active' },
  { id: '5', providerId: 'dokaaiInApp', name: 'In-app provider', channel: 'in_app', status: 'active' },
];

function integrationFolder(): PageTree.Folder {
  return {
    type: 'folder', name: 'Integration', root: true,
    children: [{ type: 'page', name: 'Overview', url: '/integration' }],
  };
}

function assertChannels(folder: PageTree.Folder) {
  assert.equal(folder.children[0].type, 'page');
  assert.deepEqual(folder.children.slice(1).map((node) => node.name), ['Email', 'In-app', 'Push', 'SMS', 'WhatsApp']);
  for (const provider of providers) {
    const groups = folder.children.filter((node): node is PageTree.Folder => node.type === 'folder');
    assert.ok(groups.some((group) => group.children.some((node) =>
      node.type === 'page' && node.url === `/integration/providers/${provider.providerId}`,
    )), provider.providerId);
  }
}

test('catalog channels load when Integration is in the main tree', () => {
  const tree: PageTree.Root = { name: 'Docs', children: [integrationFolder()] };
  const result = getIntegrationPageTree(tree, providers);
  assertChannels(result.children[0] as PageTree.Folder);
  assert.equal((tree.children[0] as PageTree.Folder).children.length, 1);
});

test('catalog channels load when Integration is omitted from root metadata', () => {
  const home: PageTree.Item = { type: 'page', name: 'Home', url: '/' };
  const api: PageTree.Folder = { type: 'folder', name: 'API Reference', root: true, children: [] };
  const tree: PageTree.Root = {
    name: 'Docs', children: [home],
    fallback: { name: 'Unlisted', children: [api, integrationFolder()] },
  };
  const result = getIntegrationPageTree(tree, providers);
  assert.equal(result.children[0], home);
  assert.equal(result.fallback?.children[0], api);
  assertChannels(result.fallback?.children[1] as PageTree.Folder);
  assert.equal((tree.fallback?.children[1] as PageTree.Folder).children.length, 1);

  for (const provider of providers) {
    const found = searchPath(result.fallback!.children, `/integration/providers/${provider.providerId}`);
    assert.ok(found?.some((node) => node.type === 'folder' && node.root && node.name === 'Integration'));
  }
});

test('catalog changes invalidate both main and fallback tree identities', () => {
  const tree: PageTree.Root = { name: 'Docs', children: [], fallback: { name: 'Unlisted', children: [integrationFolder()] } };
  const first = getIntegrationPageTree(tree, providers);
  const next = getIntegrationPageTree(tree, providers.slice(1));
  assert.notEqual(first.$id, next.$id);
  assert.notEqual(first.fallback?.$id, next.fallback?.$id);
  assert.notEqual(first.$id, first.fallback?.$id);
});

test('an unavailable catalog still preserves the Integration overview', () => {
  const tree: PageTree.Root = { name: 'Docs', children: [], fallback: { name: 'Unlisted', children: [integrationFolder()] } };
  const result = getIntegrationPageTree(tree, null);
  assert.deepEqual((result.fallback?.children[0] as PageTree.Folder).children, [
    { type: 'page', name: 'Overview', url: '/integration' },
  ]);
});

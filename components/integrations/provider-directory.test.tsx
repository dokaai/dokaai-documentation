import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { providerUrl } from '../../lib/integrations/provider-content';
import { ProviderDirectory } from './provider-directory';
import { ProviderStatusBadge } from './provider-status-badge';

for (const [status, label, icon] of [
  ['published', 'Live', 'live.svg'],
  ['beta', 'Beta', 'dot-yellow.svg'],
  ['unpublished', 'Dev', 'coming-soon.svg'],
] as const) {
  test(`${status} shows the same ${label} status asset as dokaai-web`, () => {
    const html = renderToStaticMarkup(<ProviderStatusBadge status={status} />);
    assert.ok(html.includes(`aria-label="Status: ${label}"`));
    assert.ok(html.includes(`src="/provider-status/${icon}"`));
    assert.ok(html.includes('width="16" height="16"'));
  });
}

test('status matching is case-insensitive and unknown statuses have no misleading badge', () => {
  assert.ok(renderToStaticMarkup(<ProviderStatusBadge status="PUBLISHED" />).includes('Status: Live'));
  assert.equal(renderToStaticMarkup(<ProviderStatusBadge status="unknown" />), '');
});

test('provider slugs preserve exact catalog IDs, including case and punctuation', () => {
  for (const id of ['mailerSend', 'messageBird', 'firebaseCloudMessaging', 'simpleTexting', 'whatsApp', 'dokaaiInApp', 'infobip-sms']) {
    assert.equal(providerUrl(id), `/integration/providers/${id}`);
  }
  assert.equal(providerUrl('provider/with spaces'), '/integration/providers/provider%2Fwith%20spaces');
});

test('directory cards use providerId for navigation and expose availability status', () => {
  const html = renderToStaticMarkup(<ProviderDirectory providers={[{
    id: 'database-id',
    providerId: 'mailerSend',
    name: 'Display Name',
    channel: 'email',
    status: 'beta',
    logoUrl: '/logo.svg',
    fallbackLogo: '/fallback.svg',
  }]} />);

  assert.ok(html.includes('href="/integration/providers/mailerSend"'));
  assert.ok(html.includes('Status: Beta'));
  assert.ok(html.includes('Display Name'));
  assert.ok(!html.includes('/integration/providers/database-id'));
  assert.ok(!html.includes('/integration/providers/Display'));
});

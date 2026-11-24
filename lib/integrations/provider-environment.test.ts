import assert from 'node:assert/strict';
import test, { type TestContext } from 'node:test';
import { getMetadataBase } from '../metadata';
import {
  fetchBackendCatalog,
  fetchBackendProviderDetail,
  providerLogoUrl,
} from './provider-catalog';

function environment(t: TestContext, values: Record<string, string | undefined>) {
  for (const [name, value] of Object.entries(values)) {
    const original = process.env[name];
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
    t.after(() => {
      if (original === undefined) delete process.env[name];
      else process.env[name] = original;
    });
  }
}

function backend(t: TestContext, payload: unknown) {
  environment(t, {
    AUTH_API_URL: 'https://auth.example.test',
    NUDGE_API_URL: 'https://api.example.test/nudge',
    INTERNAL_ADMIN_SECRET_KEY: 'test-internal-admin-key',
    DOKAAI_CALLER_SERVICE_ID: 'test-docs-service',
  });
  const requests: { url: string; init?: RequestInit }[] = [];
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
    requests.push({ url: String(input), init });
    return new Response(JSON.stringify(
      requests.length === 1 ? { data: { token: 'test-service-token' } } : payload,
    ), { status: 200, headers: { 'Content-Type': 'application/json' } });
  });
  return requests;
}

test('catalog requests use the renamed URLs and authenticate the token request with the internal admin key', async (t) => {
  const requests = backend(t, {
    status: 'success',
    data: [{ id: '1', providerId: 'sendgrid', name: 'SendGrid', channel: 'email', availabilityStatus: 'available' }],
  });

  const providers = await fetchBackendCatalog();

  assert.equal(providers[0].providerId, 'sendgrid');
  assert.equal(requests.length, 2);
  assert.equal(requests[0].url, 'https://auth.example.test/auth/internal-service/token');
  assert.equal(requests[0].init?.method, 'POST');
  assert.deepEqual(Object.fromEntries(new Headers(requests[0].init?.headers)), {
    'content-type': 'application/json',
    'x-internal-admin-secret-key': 'test-internal-admin-key',
  });
  assert.deepEqual(JSON.parse(String(requests[0].init?.body)), {
    callerServiceId: 'test-docs-service',
    targetServiceId: 'dokaai',
  });
  assert.equal(requests[1].url, 'https://api.example.test/nudge/notification-providers/catalog');
  const headers = new Headers(requests[1].init?.headers);
  assert.equal(headers.get('authorization'), 'Bearer test-service-token');
  assert.equal(headers.get('x-auth-mode'), 'bff');
});

test('provider detail requests use NUDGE_API_URL and encode the provider ID', async (t) => {
  const requests = backend(t, {
    status: 'success', data: { providerId: 'mail provider', credentialSchema: [] },
  });

  assert.deepEqual(await fetchBackendProviderDetail('mail provider'), { credentialSchema: [] });
  assert.equal(requests[1].url, 'https://api.example.test/nudge/notification-providers/catalog/mail%20provider');
});

test('missing service configuration names the new environment variable', async (t) => {
  environment(t, { AUTH_API_URL: undefined });
  await assert.rejects(fetchBackendCatalog, { message: 'AUTH_API_URL is not configured' });
});

test('a missing internal admin key stops the token request before contacting Auth', async (t) => {
  const requests = backend(t, { status: 'success', data: [] });
  environment(t, { INTERNAL_ADMIN_SECRET_KEY: undefined });
  await assert.rejects(fetchBackendCatalog, { message: 'INTERNAL_ADMIN_SECRET_KEY is not configured' });
  assert.equal(requests.length, 0);
});

test('provider logos use MARKETING_SITE_URL', (t) => {
  environment(t, { MARKETING_SITE_URL: 'https://marketing.example.test' });
  assert.equal(providerLogoUrl('sendgrid'), 'https://marketing.example.test/channel-provider/sendgrid_logo.svg');
  assert.equal(providerLogoUrl('sendgrid', 'custom.svg'), 'https://marketing.example.test/channel-provider/custom.svg');
});

test('metadata uses NEXT_PUBLIC_DOCUMENTATION_URL', (t) => {
  environment(t, { NEXT_PUBLIC_DOCUMENTATION_URL: 'https://documentation.example.test/' });
  assert.equal(getMetadataBase().href, 'https://documentation.example.test/');
});

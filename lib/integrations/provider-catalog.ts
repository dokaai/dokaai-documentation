import { cache } from 'react';
import { unstable_cache } from 'next/cache';

/** Public metadata selected from the backend catalog; never includes credential values. */
export type CredentialField = {
  key: string;
  label: string;
  fieldType: string;
  required: boolean;
  isSecure: boolean;
  description?: string;
  isReadOnly?: boolean;
};
export type Provider = {
  id: string;
  providerId: string;
  name: string;
  channel: string;
  status: string;
  logo?: string;
  docReference?: string;
  supportedPushDevices?: string[];
  credentialSchema?: CredentialField[];
};

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function nonempty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
function optionalString(value: unknown): string | undefined {
  return nonempty(value) ? value : undefined;
}

function normalizeCredentialSchema(
  value: unknown,
): CredentialField[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.flatMap((field): CredentialField[] => {
    if (
      !record(field) ||
      !nonempty(field.key) ||
      !nonempty(field.label) ||
      !nonempty(field.fieldType) ||
      typeof field.required !== 'boolean' ||
      typeof field.isSecure !== 'boolean'
    )
      return [];
    return [
      {
        key: field.key,
        label: field.label,
        fieldType: field.fieldType,
        required: field.required,
        isSecure: field.isSecure,
        ...(optionalString(field.description)
          ? { description: optionalString(field.description) }
          : {}),
        ...(typeof field.isReadOnly === 'boolean'
          ? { isReadOnly: field.isReadOnly }
          : {}),
      },
    ];
  });
}

/** Select only documented schema metadata from the detail response. */
export function normalizeProviderDetail(
  value: unknown,
  providerId: string,
): { credentialSchema?: CredentialField[] } {
  if (!record(value) || value.status !== 'success' || !record(value.data)) {
    throw new Error('Invalid provider detail response');
  }
  if (
    value.data.providerId !== undefined &&
    value.data.providerId !== providerId
  ) {
    throw new Error('Provider detail does not match requested provider');
  }
  if (
    value.data.credentialSchema !== undefined &&
    !Array.isArray(value.data.credentialSchema)
  ) {
    throw new Error('Invalid provider credential schema');
  }
  return {
    credentialSchema: normalizeCredentialSchema(value.data.credentialSchema),
  };
}

export function normalizeCatalog(value: unknown): Provider[] {
  if (
    !record(value) ||
    value.status !== 'success' ||
    !Array.isArray(value.data)
  ) {
    throw new Error('Invalid provider catalog response');
  }
  const providers = value.data.map((item): Provider => {
    if (
      !record(item) ||
      !nonempty(item.id) ||
      !nonempty(item.providerId) ||
      !nonempty(item.name) ||
      !nonempty(item.channel) ||
      !nonempty(item.availabilityStatus)
    ) {
      throw new Error('Invalid provider in catalog response');
    }
    const logo = record(item.logoFileName)
      ? (optionalString(item.logoFileName.dark) ??
        optionalString(item.logoFileName.light))
      : optionalString(item.logoFileName);
    const credentialSchema = normalizeCredentialSchema(item.credentialSchema);
    return {
      id: item.id,
      providerId: item.providerId,
      name: item.name,
      channel: item.channel,
      status: item.availabilityStatus,
      logo,
      docReference: optionalString(item.docReference),
      supportedPushDevices: Array.isArray(item.supportedPushDevices)
        ? item.supportedPushDevices.filter(nonempty)
        : undefined,
      credentialSchema,
    };
  });
  return uniqueProviders(providers);
}

export function uniqueProviders(providers: Provider[]): Provider[] {
  const seen = new Set<string>();
  return providers.filter((provider) => {
    const key = JSON.stringify([
      provider.channel.toLowerCase(),
      provider.providerId,
    ]);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// TODO: Rename dokaai-web logo assets to <providerId>.svg (including case),
// then remove these filename overrides and use providerId directly.
const providerLogoOverrides: Record<string, string> = {
  gmail: 'gmail_logo.svg',
  sendgrid: 'sendgrid_logo.svg',
  mandrill: 'Mandrill.svg',
  mailgun: 'Mailgun.svg',
  plunk: 'Plunk.svg',
  mailerSend: 'Mailersend.svg',
  twilio: 'Twilio.svg',
  messageBird: 'messagebird.svg',
  sns: 'SNS.svg',
  'infobip-sms': 'Infobip logo.svg',
  ringCentral: 'RingCentral.svg',
  bandwidth: 'Bandwidth.svg',
  simpleTexting: 'Simpletexting.svg',
  clickatell: 'Clickatell.svg',
  nexmo: 'vonage.svg',
  dokaaiInApp: 'dokaai.svg',
  firebaseCloudMessaging: 'firebase.svg',
  oneSignal: 'OneSignal.svg',
  whatsApp: 'whatsapp.png',
};

export function providerLogoUrl(
  providerId: string,
  logoFileName?: string,
): string {
  const origin = process.env.DOKAAI_WEB_URL || 'https://dokaai.com';
  const fallback = `/channel-provider/${encodeURIComponent(providerLogoOverrides[providerId] ?? `${providerId}.svg`)}`;
  if (logoFileName) {
    try {
      const path =
        /^(https?:)?\/\//i.test(logoFileName) || logoFileName.startsWith('/')
          ? logoFileName
          : `/channel-provider/${logoFileName}`;
      const url = new URL(path, origin);
      if (url.protocol === 'http:' || url.protocol === 'https:')
        return url.toString();
    } catch {
      /* Use the mapped filename below. */
    }
  }
  return new URL(fallback, origin).toString();
}

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function endpoint(base: string, path: string): string {
  const url = new URL(
    `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`,
  );
  if (
    url.protocol !== 'https:' &&
    !(
      url.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    )
  ) {
    throw new Error(
      'Service URL must use HTTPS (HTTP is allowed for localhost)',
    );
  }
  return url.toString();
}

const REQUEST_TIMEOUT_MS = 20_000;

async function requestJson(
  stage: string,
  url: string,
  init: RequestInit,
): Promise<unknown> {
  try {
    const response = await fetch(url, {
      ...init,
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok)
      throw new Error(`${stage} returned HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === 'TimeoutError' || error.name === 'AbortError')
    ) {
      throw new Error(
        `${stage} timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds`,
      );
    }
    if (
      error instanceof Error &&
      error.message.startsWith(`${stage} returned HTTP`)
    )
      throw error;
    const cause =
      error instanceof Error &&
      record(error.cause) &&
      typeof error.cause.code === 'string'
        ? ` (${error.cause.code})`
        : '';
    throw new Error(`${stage} failed${cause}`);
  }
}

async function authenticatedBackendGet(
  path: string,
  stage: string,
): Promise<unknown> {
  const authUrl = endpoint(
    requiredEnvironment('AUTH_SERVICE_URL'),
    '/auth/internal-service/token',
  );
  const catalogUrl = endpoint(requiredEnvironment('NUDGE_SERVICE_URL'), path);
  const payload = await requestJson('Service authentication', authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-admin-secret-key': requiredEnvironment(
        'INTERNAL_ADMIN_SECRET_KEY',
      ),
    },
    body: JSON.stringify({
      callerServiceId: requiredEnvironment('DOKAAI_CALLER_SERVICE_ID'),
      targetServiceId: 'dokaai',
    }),
  });
  const data =
    record(payload) && record(payload.data) ? payload.data : undefined;
  const result =
    record(payload) && record(payload.result) ? payload.result : undefined;
  const resultData = result && record(result.data) ? result.data : undefined;
  const token =
    optionalString(data?.token) ??
    (record(payload) ? optionalString(payload.token) : undefined) ??
    optionalString(result?.token) ??
    optionalString(resultData?.token);
  if (!token) throw new Error('Service authentication did not return a token');
  return requestJson(stage, catalogUrl, {
    headers: {
      'Content-Type': 'application/json',
      'x-app-environment': 'production',
      'x-auth-mode': 'bff',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchBackendCatalog(): Promise<Provider[]> {
  return normalizeCatalog(
    await authenticatedBackendGet(
      '/notification-providers/catalog',
      'Provider catalog request',
    ),
  );
}

export async function fetchBackendProviderDetail(
  providerId: string,
): Promise<{ credentialSchema?: CredentialField[] }> {
  if (!providerId || providerId === '.' || providerId === '..')
    throw new Error('Invalid provider ID');
  const response = await authenticatedBackendGet(
    `/notification-providers/catalog/${encodeURIComponent(providerId)}`,
    'Provider detail request',
  );
  return normalizeProviderDetail(response, providerId);
}

const cachedProviderDetail = unstable_cache(
  fetchBackendProviderDetail,
  ['provider-detail-v1'],
  { revalidate: 300 },
);
export const getProviderDetail = cache(
  async (
    providerId: string,
  ): Promise<{ credentialSchema?: CredentialField[] } | null> => {
    try {
      return await cachedProviderDetail(providerId);
    } catch (error) {
      console.error(
        'Unable to load provider detail:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      return null;
    }
  },
);

const cachedCatalog = unstable_cache(
  fetchBackendCatalog,
  ['provider-catalog-v1'],
  { revalidate: 300 },
);
export const getProviderCatalog = cache(
  async (): Promise<Provider[] | null> => {
    try {
      return await cachedCatalog();
    } catch (error) {
      console.error(
        'Unable to load provider catalog:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      return null;
    }
  },
);

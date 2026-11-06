import Link from 'next/link';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/notebook/page';
import { providerLogoUrl, type Provider } from '@/lib/integrations/provider-catalog';
import { channelLabel } from '@/lib/integrations/provider-content';
import { ProviderLogo } from './provider-logo';
import { providerGuideSource } from '@/lib/source';
import { getMDXComponents } from '@/components/mdx';

export function ProviderDetail({
  provider,
  detailUnavailable = false,
}: {
  provider: Provider;
  detailUnavailable?: boolean;
}) {
  const channel = channelLabel(provider.channel);
  const guide = providerGuideSource.getPage([provider.providerId]);
  const Guide = guide?.data.body;
  let reference: string | undefined;
  try {
    const url = new URL(provider.docReference ?? '');
    if (url.protocol === 'https:' || url.protocol === 'http:')
      reference = url.toString();
  } catch {
    /* No public provider documentation URL was supplied. */
  }
  return (
    <DocsPage
      toc={guide?.data.toc}
      tableOfContent={{ enabled: Boolean(guide) }}
      tableOfContentPopover={{ enabled: Boolean(guide) }}
    >
      <div className="mb-5 space-y-3">
        <ProviderLogo
          src={providerLogoUrl(provider.providerId, provider.logo)}
          fallback={providerLogoUrl(provider.providerId)}
          name={provider.name}
          plain
          className="h-8 w-24"
        />
        <DocsTitle>
          Send {channel} notification with {provider.name} through Dokaai.
        </DocsTitle>
      </div>
      <DocsDescription>{`Connect ${provider.name} to deliver ${channel.toLowerCase()} notifications through Dokaai.`}</DocsDescription>
      <DocsBody>
        <h2>Overview</h2>
        <p>
          Connect {provider.name} as a {channel.toLowerCase()} provider in
          Dokaai, then use the integration when configuring notifications for
          this channel.
        </p>
        {provider.supportedPushDevices &&
          provider.supportedPushDevices.length > 0 && (
            <p>
              Supported devices: {provider.supportedPushDevices.join(', ')}.
            </p>
          )}
        {reference && (
          <p>
            <a href={reference} target="_blank" rel="noreferrer">
              Provider documentation ↗
            </a>
          </p>
        )}
        {Guide ? (
          <Guide components={getMDXComponents()} />
        ) : (
          <>
            <h2>Setup guide</h2>
            <p>
              A provider-specific guide is not available yet. In Dokaai, select{' '}
              {provider.name} under your organization’s notification providers
              and follow the fields shown in the integration form.
            </p>
          </>
        )}
        {detailUnavailable && (
          <p>
            Provider configuration fields are temporarily unavailable. Please
            try again later.
          </p>
        )}
        {!detailUnavailable && !provider.credentialSchema && (
          <p>
            Configuration field information is not available for this provider.
          </p>
        )}
        {!detailUnavailable && provider.credentialSchema?.length === 0 && (
          <p>No configuration fields were returned for this provider.</p>
        )}
        {provider.credentialSchema && provider.credentialSchema.length > 0 && (
          <>
            <h2>Configuration fields</h2>
            <p>
              These fields come from the provider catalog. Enter values in the
              Dokaai integration form.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Sensitive</th>
                </tr>
              </thead>
              <tbody>
                {provider.credentialSchema.map((field, index) => (
                  <tr key={`${field.key}:${index}`}>
                    <td>
                      {field.label}
                      {field.isReadOnly && <span> (read-only)</span>}
                    </td>
                    <td>{field.description ?? '—'}</td>
                    <td>{field.fieldType}</td>
                    <td>{field.required ? 'Yes' : 'No'}</td>
                    <td>{field.isSecure ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        <h2>Related resources</h2>
        <ul>
          <li>
            <Link href="/quickstart">Dokaai quickstart</Link>
          </li>
          <li>
            <Link href="/api-reference/notification-provider-integrations/get-all-integrations">
              List provider integrations API
            </Link>
          </li>
        </ul>
      </DocsBody>
    </DocsPage>
  );
}

import { getProviderCatalog, providerLogoUrl } from '@/lib/integrations/provider-catalog';
import { ProviderDirectory } from './provider-directory';
import { ProviderDirectorySkeleton } from './integration-loading';
import { Suspense } from 'react';

export function ProviderCatalog() {
  return (
    <Suspense fallback={<ProviderDirectorySkeleton />}>
      <ProviderCatalogContent />
    </Suspense>
  );
}

async function ProviderCatalogContent() {
  const providers = await getProviderCatalog();
  if (!providers)
    return (
      <p>Providers are temporarily unavailable. Please try again later.</p>
    );
  if (!providers.length) return <p>There are no providers to display yet.</p>;
  return (
    <ProviderDirectory
      providers={providers.map((provider) => ({
        ...provider,
        logoUrl: providerLogoUrl(provider.providerId, provider.logo),
        fallbackLogo: providerLogoUrl(provider.providerId),
      }))}
    />
  );
}

import { providerGuideSource } from '@/lib/source';
import { docsImageRoute } from '@/lib/shared';
import { getProviderCatalog } from './provider-catalog';
import { channelLabel, providerUrl } from './provider-content';

export async function getProviderMetadata(providerId: string) {
  const guide = providerGuideSource.getPage([providerId]);
  // Published metadata also works when catalog credentials are unavailable.
  const provider = guide ? undefined : (await getProviderCatalog())?.find(
    (item) => item.providerId === providerId,
  );
  if (!guide && !provider) return null;

  const name = guide
    ? guide.data.title.replace(/ integration guide$/i, '')
    : provider!.name;
  const integration = provider
    ? `${name} ${channelLabel(provider.channel).toLowerCase()} integration`
    : `${name} integration`;
  const title = `${integration} | Dokaai`;
  const description = guide?.data.description ?? (
    provider
      ? `Connect ${provider.name} to Dokaai, configure your ${channelLabel(provider.channel).toLowerCase()} integration, and test notification delivery.`
      : `Connect ${name} to Dokaai, follow the integration setup guide, and test notification delivery.`
  );
  const url = providerUrl(providerId);

  return {
    title,
    description,
    url,
    image: `${docsImageRoute}${url}/image.png`,
  };
}

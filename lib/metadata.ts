function normalizeSiteUrl(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getMetadataBase() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dokaai.com/documentation';

  return new URL(normalizeSiteUrl(siteUrl));
}

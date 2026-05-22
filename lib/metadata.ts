function normalizeSiteUrl(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getMetadataBase() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  return new URL(normalizeSiteUrl(siteUrl));
}

function normalizeSiteUrl(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getMetadataBase() {
  const siteUrl = process.env.NEXT_PUBLIC_DOCUMENTATION_URL ?? 'https://docs.dokaai.com';

  return new URL(normalizeSiteUrl(siteUrl));
}

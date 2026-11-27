export const channelLabels: Record<string, string> = {
  email: 'Email',
  sms: 'SMS',
  push: 'Push',
  in_app: 'In-app',
  whatsapp: 'WhatsApp',
  chat: 'Chat',
};
export function channelLabel(channel: string) {
  return channelLabels[channel.toLowerCase()] ?? channel.replace(/_/g, ' ');
}
export function providerUrl(providerId: string) {
  return `/integration/providers/${encodeURIComponent(providerId)}`;
}

import { withBasePath } from '@/lib/shared';

// Keep the labels and icons aligned with dokaai-web's provider cards.
const statusConfig: Record<string, { label: string; icon: string }> = {
  published: { label: 'Live', icon: '/provider-status/live.svg' },
  beta: { label: 'Beta', icon: '/provider-status/dot-yellow.svg' },
  unpublished: { label: 'Dev', icon: '/provider-status/coming-soon.svg' },
};

export function ProviderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status.toLowerCase()];
  if (!config) return null;

  return (
    <span
      role="img"
      aria-label={`Status: ${config.label}`}
      className="group/status relative inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-xs font-medium leading-none"
    >
      {/* These SVGs are the same status assets used by dokaai-web. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={withBasePath(config.icon)} alt="" width={16} height={16} aria-hidden="true" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-[#616161] px-2 py-1 text-[11px] font-medium leading-snug text-white opacity-0 transition-opacity group-hover/status:opacity-100 group-focus-within/provider:opacity-100"
      >
        {config.label}
        <span className="absolute left-1/2 top-full -mt-1 size-2 -translate-x-1/2 rotate-45 bg-[#616161]" />
      </span>
    </span>
  );
}

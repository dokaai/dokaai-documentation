'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Provider } from '@/lib/integrations/provider-catalog';
import { channelLabel, providerUrl } from '@/lib/integrations/provider-content';
import { ProviderLogo } from './provider-logo';

type Entry = Provider & { logoUrl: string; fallbackLogo: string };
export function ProviderDirectory({ providers }: { providers: Entry[] }) {
  const [query, setQuery] = useState('');
  const filtered = providers.filter((p) =>
    `${p.name} ${p.providerId} ${p.channel}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const groups = new Map<string, Entry[]>();
  for (const provider of filtered) {
    const group = groups.get(provider.channel) ?? [];
    group.push(provider);
    groups.set(provider.channel, group);
  }
  return (
    <div className="not-prose space-y-9">
      <label className="relative block max-w-md">
        <Search
          aria-hidden="true"
          className="absolute left-3 top-3 size-4 text-fd-muted-foreground"
        />
        <span className="sr-only">Search providers</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search providers or channels"
          className="w-full rounded-lg border border-fd-border bg-fd-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-fd-primary"
        />
      </label>
      {filtered.length === 0 && (
        <p className="text-sm text-fd-muted-foreground">
          No providers match your search.
        </p>
      )}
      {[...groups.entries()]
        .sort(([a], [b]) => channelLabel(a).localeCompare(channelLabel(b)))
        .map(([channel, entries]) => (
          <section key={channel}>
            <div className="mb-4 flex items-baseline gap-2">
              <h2 className="text-xl font-semibold">{channelLabel(channel)}</h2>
              <span className="text-sm text-fd-muted-foreground">
                {entries.length}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {entries
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((provider) => (
                  <Link
                    key={JSON.stringify([
                      provider.channel.toLowerCase(),
                      provider.providerId,
                    ])}
                    href={providerUrl(provider.providerId)}
                    className="group flex min-h-28 flex-col items-start justify-between gap-4 rounded-2xl border border-[#DEDEDE] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <ProviderLogo
                      src={provider.logoUrl}
                      fallback={provider.fallbackLogo}
                      name={provider.name}
                      plain
                      className="h-8 w-24"
                    />
                    <span className="min-w-0 text-sm font-medium leading-5 text-[#1F1F1F]">
                      {provider.name}
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        ))}
    </div>
  );
}

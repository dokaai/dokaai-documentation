'use client';

import { useState } from 'react';

export function ProviderLogo({
  src,
  fallback,
  name,
  className = '',
  plain = false,
}: {
  src: string;
  fallback?: string;
  name: string;
  className?: string;
  plain?: boolean;
}) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const current = [src, fallback].find(
    (value) => value && !failedSources.includes(value),
  );
  return (
    <span
      className={`flex shrink-0 items-center overflow-hidden ${plain ? '' : 'justify-center rounded-xl border border-fd-border bg-white p-2'} ${className}`}
    >
      {current ? (
        // Provider assets may be SVGs or externally hosted URLs.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current}
          alt=""
          className={`h-full w-full object-contain ${plain ? 'object-left' : ''}`}
          onError={() => setFailedSources((failed) => [...failed, current])}
        />
      ) : (
        <span
          aria-hidden="true"
          className="text-sm font-semibold text-fd-muted-foreground"
        >
          {name.slice(0, 1).toUpperCase()}
        </span>
      )}
    </span>
  );
}

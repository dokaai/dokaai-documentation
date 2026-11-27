import { DocsPage } from 'fumadocs-ui/layouts/notebook/page';

const bar = 'rounded-md bg-fd-muted animate-pulse motion-reduce:animate-none';

export function IntegrationSidebarSkeleton() {
  return (
    <span
      role="status"
      aria-label="Loading integration navigation"
      className="block w-full space-y-4 py-1"
    >
      <span className="sr-only">Loading integration navigation</span>
      {[0, 1, 2, 3, 4].map((item) => (
        <span
          key={item}
          className={`${bar} block h-4 ${item % 2 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </span>
  );
}

export function ProviderDirectorySkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading providers"
      className="not-prose space-y-7 py-4"
    >
      <span className="sr-only">Loading providers</span>
      <div className={`${bar} h-10 max-w-md`} />
      {[0, 1].map((group) => (
        <div key={group} className="space-y-4">
          <div className={`${bar} h-5 w-24`} />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((card) => (
              <div
                key={card}
                className="flex min-h-28 flex-col justify-between rounded-2xl border border-fd-border p-4"
              >
                <div className={`${bar} h-8 w-24`} />
                <div className={`${bar} h-4 w-20`} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function IntegrationPageSkeleton({
  detail = false,
}: {
  detail?: boolean;
}) {
  return (
    <DocsPage
      tableOfContent={{ enabled: false }}
      tableOfContentPopover={{ enabled: false }}
    >
      <div
        role="status"
        aria-label={detail ? 'Loading provider' : 'Loading integrations'}
        className="space-y-6 py-3"
      >
        <span className="sr-only">
          {detail ? 'Loading provider' : 'Loading integrations'}
        </span>
        <div className={`${bar} h-9 w-48`} />
        <div className={`${bar} h-4 max-w-lg`} />
        {detail ? (
          <div className="space-y-4 pt-6">
            <div className={`${bar} h-6 w-36`} />
            <div className={`${bar} h-4 w-full`} />
            <div className={`${bar} h-4 w-5/6`} />
            <div className={`${bar} h-24 w-full`} />
            <div className={`${bar} h-6 w-40`} />
            <div className={`${bar} h-4 w-full`} />
            <div className={`${bar} h-4 w-3/4`} />
          </div>
        ) : (
          <ProviderDirectorySkeleton />
        )}
      </div>
    </DocsPage>
  );
}

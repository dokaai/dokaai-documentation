'use client';

import type * as PageTree from 'fumadocs-core/page-tree';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTreePath } from 'fumadocs-ui/contexts/tree';
import { stripBasePath } from '@/lib/shared';
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
} from 'fumadocs-ui/components/sidebar/base';

function isActiveUrl(url: string, pathname: string) {
  return pathname === url || pathname.startsWith(`${url}/`);
}

function normalizeFilterText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function ApiSidebarSearch({ className }: { className?: string }) {
  const [filter, setFilter] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current?.parentElement;
    if (!root) return;

    const normalizedFilter = normalizeFilterText(filter);
    const groups = Array.from(root.querySelectorAll<HTMLElement>('[data-api-sidebar-group]'));
    const staticEntries = Array.from(root.querySelectorAll<HTMLElement>('a[href], p')).filter(
      (entry) => !entry.closest('[data-api-sidebar-group]') && !entry.closest('[role="searchbox"]'),
    );

    for (const entry of staticEntries) {
      const searchableText = normalizeFilterText(entry.innerText);
      entry.hidden = Boolean(normalizedFilter && !searchableText.includes(normalizedFilter));
    }

    for (const group of groups) {
      const title = normalizeFilterText(
        group.querySelector<HTMLElement>('[data-api-sidebar-group-title]')?.innerText ?? '',
      );
      const links = Array.from(group.querySelectorAll<HTMLElement>('a[href]'));
      const groupMatches = Boolean(normalizedFilter && title.includes(normalizedFilter));
      let hasVisibleLink = false;

      for (const link of links) {
        const searchableText = normalizeFilterText(link.innerText);
        const isVisible = !normalizedFilter || groupMatches || searchableText.includes(normalizedFilter);

        link.hidden = !isVisible;
        hasVisibleLink ||= isVisible;
      }

      group.hidden = Boolean(normalizedFilter) && !groupMatches && !hasVisibleLink;
    }

    return () => {
      for (const group of groups) {
        group.hidden = false;
        for (const link of group.querySelectorAll<HTMLElement>('a[href]')) {
          link.hidden = false;
        }
      }
      for (const entry of staticEntries) entry.hidden = false;
    };
  }, [filter]);

  return (
    <div ref={containerRef} className={`${className ?? ''} pb-1`}>
      <div className="relative mr-4 mt-3">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-fd-muted-foreground"
        />
        <input
          type="text"
          role="searchbox"
          aria-label="Filter API endpoints"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Filter API"
          className="h-9 w-full rounded-md border bg-transparent pl-8 pr-8 text-sm outline-none transition-colors placeholder:text-fd-muted-foreground focus:border-fd-primary"
        />
        {filter ? (
          <button
            type="button"
            aria-label="Clear API filter"
            onClick={() => setFilter('')}
            className="absolute right-1.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function ApiSidebarFolder({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: React.ReactNode;
}) {
  const pathname = stripBasePath(usePathname());
  const path = useTreePath();

  if (pathname.startsWith('/api-reference')) {
    return (
      <div data-api-sidebar-group className="mt-6 first:mt-0">
        <p
          data-api-sidebar-group-title
          className="px-2 pb-2 text-sm font-medium text-fd-foreground"
        >
          {item.name}
        </p>
        <div>{children}</div>
      </div>
    );
  }

  return (
    <SidebarFolder
      collapsible={item.collapsible}
      active={path.includes(item)}
      defaultOpen={item.defaultOpen}
    >
      {item.index ? (
        <SidebarFolderLink
          href={item.index.url}
          active={isActiveUrl(item.index.url, pathname)}
          external={item.index.external}
        >
          {item.icon}
          {item.name}
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger>
          {item.icon}
          {item.name}
        </SidebarFolderTrigger>
      )}
      <SidebarFolderContent>{children}</SidebarFolderContent>
    </SidebarFolder>
  );
}

'use client';

import type * as PageTree from 'fumadocs-core/page-tree';
import { usePathname } from 'next/navigation';
import { useTreePath } from 'fumadocs-ui/contexts/tree';
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
} from 'fumadocs-ui/components/sidebar/base';

function isActiveUrl(url: string, pathname: string) {
  return pathname === url || pathname.startsWith(`${url}/`);
}

export function ApiSidebarFolder({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const path = useTreePath();

  if (pathname.startsWith('/api-reference')) {
    return (
      <div className="mt-6 first:mt-0">
        <p className="px-2 pb-2 text-sm font-medium text-fd-foreground">{item.name}</p>
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

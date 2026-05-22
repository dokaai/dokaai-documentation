import { BookOpen, Code, Plug } from 'lucide-react';
import type { LayoutTab } from 'fumadocs-ui/layouts/shared';

export const docsTabs: LayoutTab[] = [
  {
    title: 'Documentation',
    description: 'Product docs',
    url: '/documentation',
    icon: <BookOpen className="size-4" />,
  },
  {
    title: 'Integration',
    description: 'Integration guides',
    url: '/integration',
    icon: <Plug className="size-4" />,
  },
  {
    title: 'API Reference',
    description: 'Endpoint reference',
    url: '/api-reference',
    icon: <Code className="size-4" />,
  },
] satisfies LayoutTab[];

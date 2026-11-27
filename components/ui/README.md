# Documentation components

Preview at `/components`. This page is separate from the documentation navigation
and is marked `noindex`. Components use the existing Fumadocs theme tokens and
`lib/cn.ts`; no additional UI library is required.

## Structure and exports

```text
components/
  ui/
    index.ts                    # Shared exports for server and client components
    server.ts                   # Server-only exports, including CodeBlock
    button/
      Button.tsx
      ButtonLink.tsx
      button.types.ts
      button.styles.ts
      button.test.tsx
      index.ts
    card/                       # Card, Cards, types, tests, index
    code-block/                 # CodeBlock, types, tests, index
    image/                      # Image, types, index
    segmented-control/          # SegmentedControl, types, tests, index
    steps/index.ts              # Existing Fumadocs exports
    callout/index.ts            # Existing Fumadocs exports
  previews/
    ButtonPreview.tsx
    SegmentedControlPreview.tsx
    index.ts
```

Each component folder exposes its public components and types through `index.ts`.
Keep implementation imports within the component folder. Consumers use a barrel:

```tsx
// Shared components: usable in server or client modules.
import { Button, Image, SegmentedControl } from '@/components/ui';
import type { ButtonProps, ImageProps } from '@/components/ui';

// Server components and MDX registration: includes the async highlighter.
import { CodeBlock, Card, Steps, Step, Callout } from '@/components/ui/server';
```

The shared barrel deliberately excludes CodeBlock. The server barrel has a
`server-only` guard, so importing it into client code produces a build error
instead of bundling Shiki. Individual component barrels are also available, such
as `@/components/ui/button`. Preview code stays outside the reusable UI library.

Run the colocated component tests with:

```bash
node --import tsx --test components/ui/*/*.test.tsx
```

## Buttons

```tsx
import { Button, ButtonLink } from '@/components/ui/button';

<Button variant="primary" size="md" onClick={save}>Save</Button>
<Button loading>Saving</Button>
<Button size="icon" aria-label="Add item"><Plus aria-hidden="true" /></Button>
<ButtonLink href="/">Read documentation</ButtonLink>
```

Variants: `primary`, `secondary`, `outline`, `ghost`. Sizes: `sm`, `md`, `lg`,
`icon`. Native button props and refs are supported. Buttons default to
`type="button"`; use `type="submit"` explicitly for forms. Loading disables the
button and keeps its label. Provide an accessible label for icon-only buttons.
Use `ButtonLink` for navigation; it supports Next.js Link props and adds
`noopener noreferrer` for a new tab.

## Cards

```tsx
import { Card, Cards } from '@/components/ui/card';

<Cards>
  <Card title="Overview" description="Start here." href="/" />
  <Card title="Details">Supporting content.</Card>
</Cards>
```

These wrap Fumadocs cards, retaining `title`, `description`, `icon`, `href`,
`external`, and children. `Cards` uses one column on small screens and two on
larger screens. A card with `href` is one link; keep its children free of buttons
or other links. Customize spacing and layout with `className`.

## Code blocks

```tsx
import { CodeBlock } from '@/components/ui/server';

<CodeBlock code={'console.log("Hello world");'} language="javascript" title="example.js" />
```

`CodeBlock` is an async **server component**. Import it from the server barrel
or use it in MDX; pass it as children to a client component if needed.
Shiki highlights code on the server. Fumadocs provides scrolling, keyboard focus,
and copying. Unknown languages fall back to plain text. `title` defaults to the
language; set `allowCopy={false}` to hide copying. Standard fenced MDX code blocks
continue to use Fumadocs' existing renderer.

## Segmented control

```tsx
'use client';
import { useState } from 'react';
import { SegmentedControl } from '@/components/ui/segmented-control';

const items = [{ value: 'web', label: 'Web' }, { value: 'ios', label: 'iOS' }];
// Inside your component:
const [platform, setPlatform] = useState('web');
<SegmentedControl label="Platform" items={items} value={platform} onValueChange={setPlatform} />
```

Use `defaultValue` for uncontrolled selection. Without a value, the first enabled
item is selected. Items require unique `value` strings and accessible labels;
they can include a `count` or be `disabled`. Supported options: `size="sm" | "md"`,
`variant="primary" | "surface"`, `fullWidth`, and whole-control `disabled`.

This is a single-choice radio group, not a tab panel system. Native radios support
Tab, arrow keys, Space, and form submission through `name`. Keep `name` unique
between independent groups, or omit it to generate one automatically. Use
Fumadocs Tabs for associated tab panels. Do not nest interactive elements in item
labels.

## Images

```mdx
<Image
  src="/images/project-settings.png"
  alt="Project settings with email enabled and SMS disabled."
  width={1280}
  height={720}
  caption="Enable the channels required by your project."
/>
```

Use actual image dimensions to reserve layout space. `alt` must describe the
relevant screen details; the optional caption explains why the image matters.
Images retain their aspect ratio, fit the page width, and load lazily by default.
Fumadocs provides the zoom dialog and keyboard controls; use `zoom={false}` to
disable zoom. `className` styles the image; `figureClassName` styles the figure.
Next.js Image props such as `sizes` and `priority` are also supported. Store
images in `public/images`; remote images require the usual Next.js image
configuration. The preview image is a capture of our own component preview.

## Related links

Compose related documentation with a Markdown heading and the existing cards:

```mdx
## Related links

<Cards>
  <Card title="Overview" description="Start here." href="/" />
</Cards>
```

## Steps and callouts

These are existing Fumadocs components, exposed directly without custom wrappers.

```mdx
<Steps>
  <Step>
    ### Create a project

    Hello world.
  </Step>
  <Step>
    ### Enable a service

    Hello world.
  </Step>
</Steps>

<Callout type="info" title="Note">Hello world.</Callout>
<Callout type="idea" title="Tip">Hello world.</Callout>
<Callout type="warn" title="Warning">Hello world.</Callout>
```

Use normal Markdown headings in steps so they participate in Fumadocs' table of
contents. Keep page headers in frontmatter, sections as Markdown headings, and
tables as Markdown tables; the existing table renderer already scrolls on narrow
screens.

All named components above are available in MDX without imports. For TSX, use the
shared or server barrel described above, or an individual component's `index.ts`.

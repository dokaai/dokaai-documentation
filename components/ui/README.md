# Documentation components

Preview at `/components`. Documentation content and navigation are separate from
this preview. Use the existing Fumadocs theme; the brand green is `#389f7f`.

## Structure

```text
components/
  index.ts                       # Public barrel
  mdx.tsx                        # MDX component registration
  ui/
    index.ts                     # Owned components and direct Fumadocs exports
    button/                      # Button, ButtonLink, types, styles, tests, index
    card/                        # Card, Cards, types, tests, index
    image/
      Image.tsx
      image.types.ts
      index.ts
    segmented-control/
      SegmentedControl.tsx
      segmented-control.types.ts
      segmented-control.test.tsx
      index.ts
  previews/
    ButtonPreview.tsx
    FencedCodePreview.mdx
    SegmentedControlPreview.tsx
    index.ts
```

## Component boundaries

Keep an owned component where Dokaai needs meaningful visual or behavioral
variants. Keep standard documentation formatting with Markdown and Fumadocs.

| Owned component | Customization it supports |
| --- | --- |
| Button / ButtonLink | Action variants, sizes, icons, loading, disabled state, navigation styling |
| Card / Cards | Content and linked cards, spacing, layout, brand hover and focus styling |
| Image | Captions, alt text, sizing, optional zoom |
| SegmentedControl | Controlled or uncontrolled selection, counts, disabled options, sizes and appearances |

`Step`, `Steps`, `Callout`, `Tabs`, and `Tab` are re-exported directly from
Fumadocs. They already support the documentation behavior needed here. Callout
types and tab labels are content options, so they do not need custom wrappers.
Page headers, headings, tables, and fenced code blocks use the existing MDX
rendering. Introduce another wrapper only when a concrete design requirement
cannot be handled by the existing props or shared theme.

## Use the existing blocks

```tsx
import { Card, Cards, Steps, Step, Callout, Tabs, Tab } from '@/components';
```

They are available in MDX without imports. Use frontmatter for page titles and
descriptions, Markdown headings for sections, and Markdown tables for tabular
data. The existing table renderer provides horizontal scrolling.

For related documentation, compose a heading and cards:

```mdx
## Related links

<Cards>
  <Card title="Overview" description="Start here." href="/" />
</Cards>
```

Use Fumadocs Tabs for switching between examples:

```mdx
<Tabs items={['JavaScript', 'Python']}>
  <Tab value="JavaScript">Hello world.</Tab>
  <Tab value="Python">Hello world.</Tab>
</Tabs>
```

## Code examples

Write normal fenced code blocks in MDX:

````mdx
```javascript title="example.js"
console.log("Hello world");
```
````

Fumadocs provides syntax highlighting and copying. No custom CodeBlock component,
imports, server barrel, or client wrapper is required.

## Buttons and links

```tsx
import { Button, ButtonLink } from '@/components';

<Button variant="primary" size="md" onClick={save}>Save</Button>
<Button loading>Saving</Button>
<ButtonLink href="/" variant="outline">Documentation</ButtonLink>
```

Variants are `primary`, `secondary`, `outline`, and `ghost`. Sizes are `sm`, `md`,
`lg`, and `icon`. Native props and refs are supported. Buttons default to
`type="button"`; set `type="submit"` explicitly for forms. Loading disables the
button and retains its label. Icon-only buttons need an accessible label.
ButtonLink supports Next.js Link props and secures new tabs with
`noopener noreferrer`.

## Cards

Card and Cards wrap the existing Fumadocs primitives with Dokaai's spacing, focus,
and hover styling. Card accepts `title`, `description`, `icon`, `href`, `external`,
and children. Cards provides a responsive grid. Both support `className` overrides.
Keep linked cards free of nested links or buttons.

## Image

This is a small convenience component for captions, responsive sizing, and the
existing Fumadocs zoom control:

```mdx
<Image
  src="/images/project-settings.png"
  alt="Project settings with email enabled and SMS disabled."
  width={1280}
  height={720}
  caption="Enable the channels required by your project."
/>
```

Use actual dimensions to reserve space and meaningful alt text. `caption` is
optional. Set `zoom={false}` to disable zoom. `className` styles the image;
`figureClassName` styles the figure. Standard Next.js Image options are supported.
Remote images require the usual Next.js image configuration.

## SegmentedControl

Keep this for selecting a single option, rather than displaying tab panels:

```tsx
'use client';
import { useState } from 'react';
import { SegmentedControl } from '@/components';

// Inside a component:
const [platform, setPlatform] = useState('web');
<SegmentedControl
  label="Platform"
  items={[{ value: 'web', label: 'Web' }, { value: 'ios', label: 'iOS' }]}
  value={platform}
  onValueChange={setPlatform}
/>
```

Use `defaultValue` for uncontrolled selection. The first enabled item is selected
by default. Items require unique values; optional fields are `count` and
`disabled`. Options include `size="sm" | "md"`, `variant="primary" | "surface"`,
`fullWidth`, and whole-control `disabled`. Native radios provide form submission,
keyboard navigation, and focus. Give independent controls unique names or let
names generate automatically. Do not nest interactive elements in item labels.

Run the retained component tests with:

```bash
node --import tsx --test components/ui/*/*.test.tsx
```

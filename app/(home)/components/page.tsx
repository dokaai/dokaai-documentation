import type { Metadata } from 'next';
import { Bell, Code2 } from 'lucide-react';
import { ButtonPreview, SegmentedControlPreview } from '@/components/previews';
import { Card, Image, Step, Steps, Callout, Tabs, Tab } from '@/components';
import FencedCodePreview from '@/components/previews/FencedCodePreview.mdx';
import { getMDXComponents } from '@/components/mdx';
import MarkdownPreview from '@/components/previews/MarkdownPreview.mdx';

export const metadata: Metadata = {
  title: 'Component preview | Dokaai Documentation',
  description: 'Preview the shared documentation UI components.',
  robots: { index: false, follow: false },
};

export default function ComponentPreviewPage() {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-12 px-6 py-12 text-fd-foreground">
      <header className="space-y-3">
        <p className="text-sm font-medium text-fd-primary">Dokaai Documentation</p>
        <h1 className="text-3xl font-semibold tracking-tight">Component preview</h1>
        <p className="text-fd-muted-foreground">Shared components using the documentation theme.</p>
      </header>

      <section aria-labelledby="maintained-components" className="space-y-8">
        <header className="space-y-2 border-b border-fd-border pb-4">
          <h2 id="maintained-components" className="text-2xl font-semibold tracking-tight">Components we maintain</h2>
          <p className="text-sm text-fd-muted-foreground">Dokaai components with our own visual variants and behavior.</p>
        </header>

        <section aria-labelledby="buttons" className="space-y-4">
          <h3 id="buttons" className="text-lg font-semibold">Buttons</h3>
          <ButtonPreview />
        </section>

        <section aria-labelledby="cards" className="space-y-4">
          <h3 id="cards" className="text-lg font-semibold">Cards</h3>
          <div className="@container my-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card icon={<Bell />} title="Content card" description="Use a card to group related information.">
              Optional supporting content goes here.
            </Card>
            <Card icon={<Code2 />} title="Linked card" description="Open the documentation overview." href="/" />
          </div>
        </section>

        <section aria-labelledby="segmented-control" className="space-y-4">
          <h3 id="segmented-control" className="text-lg font-semibold">Segmented control</h3>
          <SegmentedControlPreview />
        </section>

        <section aria-labelledby="images" className="space-y-4">
          <h3 id="images" className="text-lg font-semibold">Images</h3>
          <Image
            src="/images/component-preview.png"
            alt="Documentation button variants: primary, secondary, outline, ghost, disabled, and loading."
            width={880}
            height={216}
            caption="Documentation button styles. Select the image to enlarge it; press Escape to close."
          />
        </section>

        <section aria-labelledby="related-links">
          <h3 id="related-links" className="mb-4 text-lg font-semibold tracking-tight">Related links</h3>
          <div className="@container my-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card title="Documentation" description="Open the documentation overview." href="/" />
            <Card title="Buttons" description="Return to the button examples above." href="#buttons" />
          </div>
        </section>
      </section>

      <section aria-labelledby="fumadocs-components" className="space-y-8">
        <header className="space-y-2 border-b border-fd-border pb-4">
          <h2 id="fumadocs-components" className="text-2xl font-semibold tracking-tight">Fumadocs and Markdown blocks</h2>
          <p className="text-sm text-fd-muted-foreground">Existing documentation blocks using their standard rendering, without custom wrappers.</p>
        </header>

        <section aria-labelledby="code-blocks" className="space-y-4">
          <h3 id="code-blocks" className="text-lg font-semibold">Code blocks</h3>
          <p className="text-sm text-fd-muted-foreground">Write code examples directly in MDX using fenced code blocks.</p>
          <FencedCodePreview components={getMDXComponents()} />
        </section>

        <section aria-labelledby="tabs" className="space-y-4">
          <h3 id="tabs" className="text-lg font-semibold">Tabs</h3>
          <Tabs items={['JavaScript', 'Python']}>
            <Tab value="JavaScript"><p>Hello world from JavaScript.</p></Tab>
            <Tab value="Python"><p>Hello world from Python.</p></Tab>
          </Tabs>
        </section>

        <section aria-labelledby="steps" className="prose space-y-4">
          <h3 id="steps" className="text-lg font-semibold">Steps</h3>
          <Steps>
            <Step><h4>First step</h4><p>Hello world.</p></Step>
            <Step><h4>Second step</h4><p>Hello world.</p></Step>
          </Steps>
        </section>

        <section aria-labelledby="callouts" className="space-y-4">
          <h3 id="callouts" className="text-lg font-semibold">Callouts</h3>
          <Callout title="Note" type="info">Hello world.</Callout>
          <Callout title="Tip" type="idea">Hello world.</Callout>
          <Callout title="Warning" type="warn">Hello world.</Callout>
        </section>

        <section aria-labelledby="markdown" className="space-y-4">
          <h3 id="markdown" className="text-lg font-semibold">Headings and tables</h3>
          <div className="prose">
            <MarkdownPreview components={getMDXComponents()} />
          </div>
        </section>
      </section>
    </main>
  );
}

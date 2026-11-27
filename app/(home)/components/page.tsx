import type { Metadata } from 'next';
import { Bell, Code2 } from 'lucide-react';
import { ButtonPreview, SegmentedControlPreview } from '@/components/previews';
import { Card, Cards, CodeBlock, Image, Step, Steps, Callout } from '@/components/ui/server';

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

      <section aria-labelledby="buttons" className="space-y-4">
        <h2 id="buttons" className="text-xl font-semibold">Buttons</h2>
        <ButtonPreview />
      </section>

      <section aria-labelledby="cards" className="space-y-4">
        <h2 id="cards" className="text-xl font-semibold">Cards</h2>
        <Cards>
          <Card icon={<Bell />} title="Content card" description="Use a card to group related information.">
            Optional supporting content goes here.
          </Card>
          <Card icon={<Code2 />} title="Linked card" description="Open the documentation overview." href="/" />
        </Cards>
      </section>

      <section aria-labelledby="code-blocks" className="space-y-4">
        <h2 id="code-blocks" className="text-xl font-semibold">Code blocks</h2>
        <CodeBlock
          title="example.ts"
          language="typescript"
          code={'const message = "Hello world";\nconsole.log(message);'}
        />
        <CodeBlock title="Terminal" language="bash" code={'echo "Hello world"'} allowCopy={false} />
      </section>

      <section aria-labelledby="segmented-control" className="space-y-4">
        <h2 id="segmented-control" className="text-xl font-semibold">Segmented control</h2>
        <SegmentedControlPreview />
      </section>

      <section aria-labelledby="images" className="space-y-4">
        <h2 id="images" className="text-xl font-semibold">Images</h2>
        <Image
          src="/images/component-preview.png"
          alt="Documentation button variants: primary, secondary, outline, ghost, disabled, and loading."
          width={880}
          height={216}
          caption="Documentation button styles. Select the image to enlarge it; press Escape to close."
        />
      </section>

      <section aria-labelledby="steps" className="prose space-y-4">
        <h2 id="steps" className="text-xl font-semibold">Steps</h2>
        <Steps>
          <Step><h3>First step</h3><p>Hello world.</p></Step>
          <Step><h3>Second step</h3><p>Hello world.</p></Step>
        </Steps>
      </section>

      <section aria-labelledby="callouts" className="space-y-4">
        <h2 id="callouts" className="text-xl font-semibold">Callouts</h2>
        <Callout title="Note" type="info">Hello world.</Callout>
        <Callout title="Tip" type="idea">Hello world.</Callout>
        <Callout title="Warning" type="warn">Hello world.</Callout>
      </section>

      <section aria-labelledby="related-links">
        <h2 id="related-links" className="mb-4 text-lg font-semibold tracking-tight">Related links</h2>
        <Cards>
          <Card title="Documentation" description="Open the documentation overview." href="/" />
          <Card title="Buttons" description="Return to the button examples above." href="#buttons" />
        </Cards>
      </section>
    </main>
  );
}

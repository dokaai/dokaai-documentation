'use client';

import { ArrowRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button, ButtonLink } from '@/components';

export function ButtonPreview() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setLoading(!loading)}>Primary <ArrowRight aria-hidden="true" /></Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button disabled>Disabled</Button>
        <Button loading={loading}>Loading state</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" variant="outline" aria-label="Add item"><Plus aria-hidden="true" /></Button>
        <ButtonLink href="/" variant="outline">Documentation <ArrowRight aria-hidden="true" /></ButtonLink>
      </div>
      <p className="text-sm text-fd-muted-foreground" role="status">Click Primary to toggle the loading state.</p>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { SegmentedControl } from '@/components';

const platforms = [
  { value: 'web', label: 'Web' },
  { value: 'android', label: 'Android' },
  { value: 'ios', label: 'iOS' },
  { value: 'soon', label: 'Coming soon', disabled: true },
];

export function SegmentedControlPreview() {
  const [platform, setPlatform] = useState('web');

  return (
    <div className="grid gap-4">
      <SegmentedControl label="Platform" items={platforms} value={platform} onValueChange={setPlatform} />
      <p className="text-sm text-fd-muted-foreground" role="status">Selected platform: {platform}</p>
      <SegmentedControl
        label="View"
        variant="surface"
        size="sm"
        defaultValue="preview"
        items={[{ value: 'preview', label: 'Preview' }, { value: 'code', label: 'Code' }]}
      />
      <SegmentedControl
        label="Notifications"
        fullWidth
        items={[{ value: 'all', label: 'All', count: 12 }, { value: 'unread', label: 'Unread', count: 0 }]}
      />
      <SegmentedControl label="Disabled platform selector" items={platforms.slice(0, 3)} disabled />
    </div>
  );
}

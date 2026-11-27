import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { SegmentedControl } from './index';

test('segmented selection skips disabled defaults and exposes native form semantics and zero counts', () => {
  const html = renderToStaticMarkup(<SegmentedControl label="Platform" name="platform" items={[
    { value: 'soon', label: 'Soon', disabled: true },
    { value: 'web', label: 'Web', count: 0 },
  ]} />);
  assert.match(html, /<legend[^>]*>Platform<\/legend>/);
  const inputs = html.match(/<input[^>]*>/g) ?? [];
  const disabled = inputs.find((input) => input.includes('value="soon"')) ?? '';
  const selected = inputs.find((input) => input.includes('value="web"')) ?? '';
  assert.match(disabled, /disabled=""/);
  assert.match(selected, /checked=""/);
  assert.ok(inputs.every((input) => input.includes('type="radio"') && input.includes('name="platform"')));
  assert.match(html, />0<\/span>/);
});

test('controlled selection overrides the default; disabled state applies to the entire fieldset', () => {
  const html = renderToStaticMarkup(<SegmentedControl label="View" disabled value="code" defaultValue="preview" items={[
    { value: 'preview', label: 'Preview' }, { value: 'code', label: 'Code' },
  ]} />);
  assert.match(html, /<fieldset disabled=""/);
  assert.match(html, /checked=""[^>]*value="code"/);
  assert.doesNotMatch(html, /checked=""[^>]*value="preview"/);
});

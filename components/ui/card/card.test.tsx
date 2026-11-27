import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { Card } from './index';

test('linked cards remain one link with a heading and descriptive text', () => {
  const html = renderToStaticMarkup(<Card title="Overview" description="Start here" href="/" />);
  assert.equal((html.match(/<a /g) ?? []).length, 1);
  assert.match(html, /<h3[^>]*>Overview<\/h3>/);
  assert.match(html, /Start here/);
});

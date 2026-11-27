import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { CodeBlock } from './index';

test('unknown code languages fall back to escaped plain text and copying can be disabled', async () => {
  const html = renderToStaticMarkup(await CodeBlock({ code: '<script>alert("hello")</script>', language: 'custom-language', allowCopy: false }));
  assert.match(html, /(?:&lt;|&#x3C;)script/);
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /aria-label="Copy Text"/);
});

test('highlighted code has a named scroll region and a copy action', async () => {
  const html = renderToStaticMarkup(await CodeBlock({ code: 'const message = "Hello world";', language: 'typescript', title: 'example.ts' }));
  assert.match(html, /aria-label="example.ts"/);
  assert.match(html, /role="region"/);
  assert.match(html, /aria-label="Copy Text"/);
  assert.match(html, /--shiki-light/);
});

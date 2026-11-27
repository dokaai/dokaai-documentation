import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button, ButtonLink } from './index';

test('buttons do not accidentally submit forms; loading disables the action and retains its label', () => {
  const regular = renderToStaticMarkup(<Button>Save</Button>);
  assert.match(regular, /type="button"/);
  const loading = renderToStaticMarkup(<Button loading>Save</Button>);
  assert.match(loading, /disabled=""/);
  assert.match(loading, /aria-busy="true"/);
  assert.match(loading, /Save<\/button>/);
  assert.match(renderToStaticMarkup(<Button type="submit">Submit</Button>), /type="submit"/);
});

test('navigation uses a real link and retains caller rel values when securing a new tab', () => {
  const html = renderToStaticMarkup(<ButtonLink href="https://example.com/docs" target="_blank" rel="nofollow">Docs</ButtonLink>);
  assert.match(html, /href="https:\/\/example.com\/docs"/);
  assert.match(html, /rel="nofollow noopener noreferrer"/);
  assert.doesNotMatch(html, /<button/);
});

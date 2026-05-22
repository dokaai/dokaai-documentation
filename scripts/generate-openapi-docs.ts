import { generateFiles } from 'fumadocs-openapi';
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { openapi } from '../lib/openapi';

const OUTPUT_DIR = './content/api-reference';
const PRESERVED_FILES = new Set(['meta.json', 'index.mdx', 'authentication.mdx']);

function toKebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function cleanGeneratedApiReferenceContent() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const entry of readdirSync(OUTPUT_DIR)) {
    if (PRESERVED_FILES.has(entry)) continue;

    const fullPath = join(OUTPUT_DIR, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      rmSync(fullPath, { recursive: true, force: true });
      continue;
    }

    rmSync(fullPath, { force: true });
  }
}

async function main() {
  cleanGeneratedApiReferenceContent();

  await generateFiles({
    input: openapi,
    output: OUTPUT_DIR,
    per: 'operation',
    groupBy: 'tag',
    name(result, document) {
      if (result.type === 'operation') {
        const operation = document.paths?.[result.item.path]?.[result.item.method];

        if (operation?.operationId) {
          return toKebabCase(operation.operationId);
        }

        return join(
          this.routePathToFilePath(result.item.path),
          result.item.method.toLowerCase(),
        );
      }

      const hook = document.webhooks?.[result.item.name]?.[result.item.method];
      return toKebabCase(hook?.operationId ?? result.item.name);
    },
    meta: false,
    includeDescription: true,
  });

  writeFileSync(
    `${OUTPUT_DIR}/index.mdx`,
    `---
title: API Reference
description: Dokaai API endpoints
---

Explore the Dokaai API by resource. Select an endpoint from the left navigation to view request details, schemas, examples, and responses.
`,
  );
}

void main();

import { createOpenAPI } from 'fumadocs-openapi/server';
import { readFileSync } from 'node:fs';

function getDokaaiOpenAPISchema() {
  const schema = JSON.parse(readFileSync('./api/index.json', 'utf8'));
  const declaredTags = new Set((schema.tags ?? []).map((tag: { name: string }) => tag.name));
  const tags = [...(schema.tags ?? [])];

  for (const pathItem of Object.values(schema.paths ?? {})) {
    for (const operation of Object.values(pathItem ?? {})) {
      if (!operation || typeof operation !== 'object' || !Array.isArray(operation.tags)) {
        continue;
      }

      for (const tagName of operation.tags) {
        if (declaredTags.has(tagName)) continue;

        declaredTags.add(tagName);
        tags.push({ name: tagName });
      }
    }
  }

  return {
    ...schema,
    tags,
  };
}

export const openapi = createOpenAPI({
  proxyUrl: '/api/proxy',
  input: () => ({
    'api/index.json': getDokaaiOpenAPISchema(),
  }),
});

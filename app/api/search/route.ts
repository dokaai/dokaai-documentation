import { providerGuideSource, source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

const searchSource: typeof source = {
  ...source,
  getPages: (language) => [
    ...source.getPages(language),
    ...providerGuideSource.getPages(language),
  ],
};

export const { GET } = createFromSource(searchSource, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
});

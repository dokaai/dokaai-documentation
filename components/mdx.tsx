import defaultMdxComponents from 'fumadocs-ui/mdx';
import { APIPage } from '@/components/api-page';
import type { MDXComponents } from 'mdx/types';
import { Button, ButtonLink, Card, Cards, CodeBlock, SegmentedControl, Image, Step, Steps, Callout } from '@/components/ui/server';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    APIPage,
    Button,
    ButtonLink,
    Card,
    Cards,
    CodeBlock,
    SegmentedControl,
    Image,
    Step,
    Steps,
    Callout,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

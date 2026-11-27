import type { CodeBlock as FumadocsCodeBlock } from 'fumadocs-ui/components/codeblock';
import type { ComponentProps } from 'react';

export interface CodeBlockProps extends Omit<ComponentProps<typeof FumadocsCodeBlock>, 'children'> {
  code: string;
  language?: string;
}

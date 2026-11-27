import { CodeBlock as FumadocsCodeBlock } from 'fumadocs-ui/components/codeblock';
import { bundledLanguages, codeToHtml } from 'shiki';
import { cn } from '@/lib/cn';
import type { CodeBlockProps } from './code-block.types';

/** Server component: only the highlighted HTML and copy control reach the browser. */
export async function CodeBlock({ code, language = 'text', title, className, viewportProps, ...props }: CodeBlockProps) {
  const lang = Object.hasOwn(bundledLanguages, language) ? language as keyof typeof bundledLanguages : 'text';
  const html = await codeToHtml(code, {
    lang,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
    tabindex: false,
  });

  return (
    <FumadocsCodeBlock
      {...props}
      title={title ?? language}
      className={cn('rounded-xl border-fd-border shadow-sm', className)}
      viewportProps={{ 'aria-label': title ?? `${language} code`, ...viewportProps }}
    >
      <div
        className="[&_pre]:m-0 [&_pre]:min-w-full [&_pre]:w-max [&_pre]:bg-transparent [&_pre]:px-4 [&_pre]:text-[0.8125rem] [&_pre]:leading-6 [&_code]:grid"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </FumadocsCodeBlock>
  );
}

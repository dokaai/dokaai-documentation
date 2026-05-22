'use client';

import {
  DefaultResultDisplay,
  type ResultDisplayProps,
} from 'fumadocs-openapi/playground/client';
import { defineClientConfig } from 'fumadocs-openapi/ui/client';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { CircleCheck, CircleX } from 'lucide-react';

function getContentType(headers: Headers) {
  return headers.get('content-type')?.split(';')[0]?.trim().toLowerCase();
}

function formatJsonResponse(data: ResultDisplayProps['data']) {
  if (data.type !== 'response' || data.body.byteLength === 0) return;

  const contentType = getContentType(data.headers);
  if (contentType !== 'application/json' && !contentType?.endsWith('+json')) return;

  try {
    const text = new TextDecoder('utf-8').decode(data.body);
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return;
  }
}

function getStatusInfo(status: number) {
  if (status >= 200 && status < 300) {
    return {
      description: 'Successful',
      color: 'text-green-500',
      icon: CircleCheck,
    };
  }

  return {
    description: 'Error',
    color: 'text-red-500',
    icon: CircleX,
  };
}

function PrettyJsonResultDisplay(props: ResultDisplayProps) {
  const formattedJson = formatJsonResponse(props.data);

  if (!formattedJson || props.data.type !== 'response') {
    return <DefaultResultDisplay {...props} />;
  }

  const statusInfo = getStatusInfo(props.data.status);
  const StatusIcon = statusInfo.icon;
  const contentType = getContentType(props.data.headers) ?? 'application/json';

  return (
    <div className="mt-2 flex flex-col gap-2 border-y bg-fd-secondary px-3 py-2 text-fd-secondary-foreground">
      <div className="flex items-center gap-1.5">
        <StatusIcon className={`size-4 shrink-0 ${statusInfo.color}`} />
        <p className="text-sm font-medium text-nowrap">
          {props.data.status} {statusInfo.description}
        </p>
        <code className="ms-auto truncate text-xs text-fd-muted-foreground">{contentType}</code>
        <button
          type="button"
          className={buttonVariants({ size: 'sm', variant: 'outline' })}
          onClick={() => props.reset()}
        >
          Close
        </button>
      </div>
      <DynamicCodeBlock
        lang="json"
        code={formattedJson}
        codeblock={{
          className: 'my-0',
          viewportProps: {
            style: {
              maxHeight: '40rem',
            },
          },
        }}
      />
    </div>
  );
}

export default defineClientConfig({
  playground: {
    fetchOptions: {
      requestTimeout: 30,
      onRequestInit(requestInit) {
        return {
          ...requestInit,
          method: requestInit.method?.toUpperCase(),
          cache: 'no-store',
        };
      },
    },
    components: {
      ResultDisplay: PrettyJsonResultDisplay,
    },
  },
});

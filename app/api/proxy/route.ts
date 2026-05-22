const ALLOWED_ORIGINS = new Set([
  'https://dev-api-service-718412652823.asia-south1.run.app',
  'http://localhost:3009',
]);

const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

async function handle(request: Request) {
  const method = request.method.toUpperCase();
  const searchParams = new URL(request.url).searchParams;
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return Response.json({ message: 'Missing proxy target url.' }, { status: 400 });
  }

  let targetUrl: URL;

  try {
    targetUrl = new URL(rawUrl);
  } catch {
    return Response.json({ message: 'Invalid proxy target url.' }, { status: 400 });
  }

  if (!ALLOWED_ORIGINS.has(targetUrl.origin)) {
    return Response.json(
      {
        message: `Proxy target origin is not allowed: ${targetUrl.origin}`,
      },
      { status: 400 },
    );
  }

  const headers = new Headers(request.headers);
  headers.delete('origin');
  headers.delete('host');
  headers.delete('connection');

  const cookie = searchParams.get('cookie');
  if (cookie) {
    headers.set('cookie', cookie);
  }

  let body: ArrayBuffer | undefined;

  if (METHODS_WITH_BODY.has(method)) {
    const bodyBuffer = await request.arrayBuffer();

    if (bodyBuffer.byteLength > 0) {
      body = bodyBuffer;
      headers.set('content-length', String(bodyBuffer.byteLength));
    }
  }

  if (!body) {
    headers.delete('content-length');
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: 'no-cache',
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.forEach((_value, key) => {
      if (key.toLowerCase().startsWith('access-control-')) {
        responseHeaders.delete(key);
      }
    });
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');
    responseHeaders.delete('transfer-encoding');
    responseHeaders.set('x-forwarded-host', response.url);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown proxy failure';

    console.error('[docs proxy] request failed', {
      method,
      targetUrl: targetUrl.toString(),
      message,
    });

    return Response.json(
      {
        message: 'Proxy request failed.',
        targetUrl: targetUrl.toString(),
        details: message,
      },
      { status: 500 },
    );
  }
}

export const GET = handle;
export const HEAD = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;

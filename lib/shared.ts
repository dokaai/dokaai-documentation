export const appName = 'Dokaai Documentation';
export const docsBasePath: string = '/';
export const docsRoute = '';

export function withBasePath(path: string) {
  if (!path) return docsBasePath || '/';

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!docsBasePath || docsBasePath === '/') {
    return normalizedPath;
  }

  return `${docsBasePath}${normalizedPath}`;
}

export function stripBasePath(path: string) {
  if (!docsBasePath || docsBasePath === '/' || !path.startsWith(docsBasePath)) {
    return path;
  }

  const strippedPath = path.slice(docsBasePath.length);
  return strippedPath || '/';
}

export const docsImageRoute = withBasePath('/og');
export const docsContentRoute = withBasePath('/llms.mdx');

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: 'dokaai',
  repo: 'dokaai-documentation',
  branch: 'main',
};

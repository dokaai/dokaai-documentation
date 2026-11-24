import { createMDX } from 'fumadocs-mdx/next';
import { fileURLToPath } from 'node:url';
import { documentationRedirects } from './lib/documentation-redirects.mjs';

const withMDX = createMDX();
const rootDir = fileURLToPath(new URL('.', import.meta.url));
const basePath = '';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  basePath,
  async redirects() {
    return documentationRedirects;
  },
  turbopack: {
    root: rootDir,
  },
};

export default withMDX(config);

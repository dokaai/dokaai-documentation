import { createMDX } from 'fumadocs-mdx/next';
import { fileURLToPath } from 'node:url';

const withMDX = createMDX();
const rootDir = fileURLToPath(new URL('.', import.meta.url));
const basePath = '/documentation';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  basePath,
  turbopack: {
    root: rootDir,
  },
};

export default withMDX(config);

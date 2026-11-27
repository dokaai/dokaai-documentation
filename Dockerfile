FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_DOCUMENTATION_URL

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_DOCUMENTATION_URL=$NEXT_PUBLIC_DOCUMENTATION_URL

RUN pnpm exec fumadocs-mdx && pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.source ./.source
COPY --from=builder /app/source.config.ts ./source.config.ts

EXPOSE 8080

CMD ["node", "server.js"]

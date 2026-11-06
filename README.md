# dokaai-documentation

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Explore

In the project, you can see:

- `lib/source.ts`: Code for content source adapter, [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `lib/layout.shared.tsx`: Shared options for layouts, optional but preferred to keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

### Fumadocs MDX

A `source.config.ts` config file has been included, you can customise different options like frontmatter schema.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs

### Provider integrations

The documentation server calls the same backend API used by dokaai-web:
`GET <NUDGE_SERVICE_URL>/notification-providers/catalog`. Set `NUDGE_SERVICE_URL`
(including the Nudge service path if needed), `AUTH_SERVICE_URL`,
`INTERNAL_ADMIN_SECRET_KEY`, and `DOKAAI_CALLER_SERVICE_ID` on the server. The
caller service ID must be registered and authorized to request a token for the
`dokaai` service. The server obtains that token from
`POST <AUTH_SERVICE_URL>/auth/internal-service/token`, then calls the catalog
with BFF authentication. None of these secrets are sent to the browser.

Provider pages also call `GET <NUDGE_SERVICE_URL>/notification-providers/catalog/<providerId>`
for their configuration fields. Successful catalog and detail results are cached for five minutes; an unavailable or invalid
response produces an unavailable message. The optional `DOKAAI_WEB_URL` is only
used to resolve relative logo assets, not to fetch provider data.

The API owns provider identity (`providerId`), name, channel and availability.
The detail URL is `/integration/providers/<providerId>` (URL encoded), so IDs must
remain stable. The page renders `provider-guides/<providerId>.mdx` directly below
the live provider details. For example, edit `provider-guides/sendgrid.mdx` to
change the SendGrid detail page. Filenames must exactly match the API provider ID,
including capitalization. Use normal MDX for headings, links, examples, and other
content. New API providers appear automatically and show a
short fallback until their guide is added. Provider URLs and their embedded guides
depend on the live catalog and are not included in the static sitemap or Fumadocs
search.

Provider logos use the catalog's `logoFileName` when present, following dokaai-web's
resolution rules. Otherwise, known filename differences are mapped to assets under
`DOKAAI_WEB_URL/channel-provider/`; other providers use `<providerId>.svg`.
If the API image fails, the mapped asset is tried before showing an initial.
The docs can display optional
`docReference` and `supportedPushDevices` fields when the backend catalog exposes
them. When the detail response includes `credentialSchema`, only the field key, label,
description, type, required, read-only, and secure flags are selected for display; credential values,
defaults, and other backend fields are not included. Add reviewed provider-specific
instructions in the matching `provider-guides/<providerId>.mdx`.

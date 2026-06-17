# SEO Guidelines

This document is the working SEO reference for `dokaai-documentation`.

Use it when creating or updating docs pages so the content stays:

- discoverable in search engines
- easy to parse by AI systems and LLM crawlers
- consistent across the documentation site

## Scope

These guidelines apply to:

- `content/**/*.mdx`
- landing and concept pages
- integration guides
- hand-written API documentation pages

Generated API pages should follow these rules at the source that generates them, not by editing generated MDX directly.

## Core Principles

1. Write for user intent first, not keyword stuffing.
2. Keep one page focused on one clear topic.
3. Make answers easy to scan in both browser UI and plain-text extraction.
4. Use consistent product terminology across all pages.
5. Prefer clarity over marketing language.

## AI Compatibility Rules

This repo already exposes machine-readable docs content through LLM-friendly routes. Future content should stay compatible with AI summarization, retrieval, and answer generation.

### Do

- Use a clear, literal page title that matches the actual topic.
- Start the page with a short explanation of what the page covers.
- Put the most important answer early.
- Use descriptive headings like `Requirements`, `Steps`, `Example Request`, `Example Response`, `Errors`, and `Limitations`.
- Write short paragraphs and short lists.
- Define acronyms on first use.
- Keep terminology stable. If the product term is `notification handler`, do not switch to other names for the same thing.
- Include concrete examples where the user may need exact syntax, payloads, or URLs.
- Make prerequisites explicit.
- State when something is optional, required, deprecated, or generated.

### Do Not

- Do not write vague headings like `Overview 2` or `More Info`.
- Do not hide critical information only inside long paragraphs.
- Do not mix multiple unrelated topics into one page.
- Do not use internal shorthand that external readers or AI systems cannot infer.
- Do not rely on screenshots alone for important instructions.
- Do not use filler text to repeat the same keyword unnaturally.
- Do not edit generated API reference MDX by hand.

## Page Structure

Use this structure when it fits the page type:

1. Title
2. One-sentence summary
3. Why this matters or when to use it
4. Requirements or prerequisites
5. Main steps or explanation
6. Examples
7. Edge cases, limits, or troubleshooting
8. Related pages

Not every page needs every section, but most pages should have a visible structure close to this.

## Writing Rules

### Titles

- Make the title specific and human-readable.
- Include the actual feature or API action name.
- Avoid generic titles like `Introduction` unless the page is a real top-level intro page.

### Headings

- Use headings that reflect real user questions.
- Keep heading hierarchy clean.
- Avoid skipping levels just for styling.

### Content

- Prefer direct language.
- Explain actions with verbs: `Create`, `Update`, `Get`, `Delete`, `Configure`.
- Use exact field names and endpoint paths when discussing API behavior.
- Keep duplicate explanations to a minimum and link to the canonical page when needed.

### Links

- Link related pages using meaningful anchor text.
- Prefer linking to the canonical source page instead of repeating the same explanation in multiple places.

## SEO Do

- Match the page topic to likely search intent.
- Use the primary phrase naturally in the title, intro, and one or two headings if relevant.
- Include supporting terms only where they help clarity.
- Cover the main question completely enough that the page can stand on its own.
- Add examples that reflect realistic user tasks.
- Keep content current when APIs, routes, or product names change.

## SEO Do Not

- Do not over-repeat the same keyword.
- Do not create near-duplicate pages for slight wording changes.
- Do not use clickbait titles.
- Do not leave outdated endpoint names, old UI labels, or removed features in published docs.
- Do not bury the answer below large blocks of unrelated explanation.

## MDX-Specific Guidance

- Keep prose readable even if custom components are stripped out in plain-text extraction.
- Add surrounding text before complex components so the page still makes sense in `llms.txt` or markdown export.
- Use tables only when they genuinely improve comparison. Lists are usually easier for AI and users to parse.
- When embedding API components, ensure the surrounding summary explains the operation in plain language.

## Structured Data Notes

- Use structured data only when it accurately matches the visible page content.
- Treat Google's supported rich result types as the source of truth, not generic schema.org availability.
- Do not add structured data just because a schema type exists.
- Prefer JSON-LD when structured data is needed.

### FAQ Warning

- Do not plan new documentation SEO work around `FAQPage` rich results for Google Search.
- Google states that as of May 7, 2026, FAQ rich results no longer appear in Google Search.
- Google also states the FAQ search appearance, rich result report, and Rich Results Test support will be removed in June 2026, with Search Console API support removed in August 2026.
- If a page has a FAQ section for user clarity, keep it as normal readable content. Do not treat FAQ markup as an active Google growth tactic.

## Generated API Docs

For generated API reference files:

- do not manually edit generated `.mdx` files
- improve SEO and clarity in the OpenAPI source, generation script, or supporting hand-written docs
- add concise descriptive summaries wherever the generation pipeline supports them

## Pre-Publish Checklist

Before merging a docs page, check:

- Is the page topic clear from the title alone?
- Does the first paragraph answer what this page is about?
- Are the headings descriptive?
- Is the terminology consistent with the rest of the docs?
- Is there at least one concrete example if the topic is procedural or API-driven?
- Would the page still make sense if read as plain text without UI styling?
- Is any generated content being edited in the correct source location instead of directly?

## Quick Reference

### Good

- one page per topic
- clear titles and headings
- concise summaries
- realistic examples
- consistent naming
- plain language

### Avoid

- duplicate content
- keyword stuffing
- vague headings
- mixed topics on one page
- hidden prerequisites
- hand-editing generated docs

## Maintenance

Update this file when:

- content patterns change
- metadata or routing conventions change
- AI/LLM output requirements change
- the docs generation flow changes

When in doubt, optimize for:

- accurate information
- easy scanning
- plain-text readability
- one canonical source of truth

## External References

Use these as the primary reference set before changing SEO or structured data patterns:

- Google Search Central: Structured data markup that Google Search supports
  - https://developers.google.com/search/docs/appearance/structured-data/search-gallery
- Google Search Central: General structured data guidelines
  - https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google Search Central: Introduction to structured data markup in Google Search
  - https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google Search Central: AI features and your website
  - https://developers.google.com/search/docs/appearance/ai-features
- Google Search Central: Guidance on using generative AI content on your website
  - https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- Google Search Central: FAQ structured data
  - https://developers.google.com/search/docs/appearance/structured-data/faqpage

### How To Use These References

- Check Google Search Central before introducing new structured data types.
- Reconfirm whether a rich result is still supported before implementing it.
- Use Google's documentation as the definitive source for Google behavior, even when schema.org supports a broader type.

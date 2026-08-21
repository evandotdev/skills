---
name: nextjs-optimize-links
description: Replace internal HTML links with next/link and configure navigation correctly in a Next.js application. User-invoked.
disable-model-invocation: true
---

# Optimize Next.js Links

Replace application links to Next.js pages with `next/link`, preserve native links where a client-side route transition is wrong, and prove the project still builds.

Use the installed Next.js version's [Link documentation](https://nextjs.org/docs/app/api-reference/components/link) when an API differs by version.

## Steps

### 1. Inspect the project

Read the repository instructions, `package.json`, lockfile, `next.config.*`, TypeScript config, lint/test config, and nearby navigation code before editing.

Confirm the project uses Next.js. Detect:

- the installed Next.js version;
- App Router or Pages Router;
- `basePath`, locale routing, redirects, and rewrites;
- shared link, button, navigation, and menu components;
- typed routes and local link conventions.

**Done when:** the routing setup, shared abstractions, and validation commands are known.

### 2. Find links

Search application source for:

- `<a>` elements;
- wrappers that render `<a>`;
- buttons or click handlers used only to navigate to a page;
- existing `<Link>` instances with nested anchors, invalid targets, or unnecessary `prefetch={false}`.

Exclude generated output, dependencies, fixtures that intentionally contain raw HTML, and documentation examples.

Classify every application link:

- **Internal page route:** a route handled by this Next.js application.
- **External URL:** another origin or an explicit external destination.
- **Native resource/action:** `mailto:`, `tel:`, downloads, files, API endpoints, or another destination that requires a document request.
- **Same-page fragment:** a local `#fragment` jump.

**Done when:** every application `<a>` has a known destination type.

### 3. Optimize navigation

For each internal page route, import:

```tsx
import Link from 'next/link'
```

Replace its `<a>` with `<Link>`. Preserve:

- `href`;
- children and accessible name;
- `className`, styles, IDs, ARIA attributes, and data attributes;
- deliberate `target`, `rel`, scroll, replace, and history behavior;
- analytics handlers that do not block navigation.

Modern `Link` renders an anchor. Do not put an `<a>` child inside it unless the installed Next.js version explicitly requires the legacy pattern.

Keep native `<a>` for external URLs, downloads, non-page resources, protocol actions, and same-page fragment jumps. Preserve the project's security and referrer policy for external links. Do not add `noreferrer` automatically because it changes referrer behavior.

Use a `<button>` for an action and `<Link>` for navigation. Replace `onClick={() => router.push(...)}` with `<Link>` when the interaction is only navigation and can have a real `href`. Keep imperative routing when navigation depends on completed logic that cannot be represented as a link.

Keep automatic prefetching by default. Set `prefetch={false}` only when the project has evidence that prefetching that route wastes material resources, such as a very large list of links.

For dynamic routes, construct a valid `href` from trusted route values. Preserve query parameters and fragments. Do not hide an invalid route with a type assertion.

**Done when:** every internal page route uses `Link`, native anchors remain only where native navigation is intentional, and controls use correct link/button semantics.

### 4. Validate

Run the affected formatter, linter, type checker, tests, and production build using repository scripts.

Search application source again and account for every remaining `<a>`. Inspect changed navigation in production mode and confirm:

- internal links navigate without a full document reload;
- external, download, protocol, and fragment links still behave correctly;
- browser open-in-new-tab, copy-link, keyboard, focus, and back/forward behavior work;
- active-state and analytics behavior remain correct;
- no nested-anchor or hydration errors occur;
- prefetching is not disabled without a recorded reason.

Fix failures before finishing.

**Done when:** all internal page routes use `next/link`, each remaining `<a>` is intentional, and all affected checks pass.

## Report

State:

- files changed;
- internal anchors replaced;
- imperative navigation replaced;
- intentional native anchors that remain;
- validation commands and results.

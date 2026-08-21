---
name: nextjs-optimize-images
description: Replace HTML images with next/image and configure them correctly in a Next.js application. User-invoked.
disable-model-invocation: true
---

# Optimize Next.js Images

Replace application `<img>` elements with `next/image`, configure each image for its layout, and prove the project still builds.

Use the installed Next.js version's [Image documentation](https://nextjs.org/docs/app/api-reference/components/image) when an API differs by version.

## Steps

### 1. Inspect the project

Read the repository instructions, `package.json`, lockfile, `next.config.*`, TypeScript config, lint/test config, and nearby image usage before editing.

Confirm the project uses Next.js. Detect:

- the installed Next.js version;
- App Router or Pages Router;
- existing `images.remotePatterns`, custom loaders, `unoptimized`, formats, and qualities;
- local image conventions and shared image wrappers.

**Done when:** the Next.js version, image configuration, and validation commands are known.

### 2. Find images

Search application source for:

- `<img>` elements;
- wrappers that render `<img>`;
- `next/image` instances with missing layout information;
- remote image hosts absent from `remotePatterns`.

Exclude generated output, dependencies, fixtures that intentionally contain raw HTML, and documentation examples.

List every application `<img>` before editing. Account for each one.

**Done when:** every application `<img>` has an owner and source type.

### 3. Replace every application `<img>`

Import:

```tsx
import Image from 'next/image'
```

Then replace each `<img>` with `<Image>`. Preserve its `src`, meaningful `alt`, styling, classes, event behavior, and accessibility.

Choose image dimensions by source:

- **Static local import:** import the file and let Next.js infer intrinsic dimensions.
- **`public` path:** supply the real intrinsic `width` and `height`.
- **Remote URL:** supply the real intrinsic `width` and `height`, or use `fill` inside a correctly sized positioned parent.
- **Unknown responsive dimensions:** use `fill`, reserve the aspect ratio in the parent, and add an accurate `sizes` value.

`width` and `height` describe intrinsic aspect ratio. Keep CSS responsible for rendered size.

For responsive images:

- add `sizes` whenever CSS or `fill` makes the rendered width responsive;
- make `sizes` match actual breakpoints;
- avoid `sizes="100vw"` unless the image really spans the viewport.

For remote images, add the narrowest valid `images.remotePatterns` entry. Restrict protocol, hostname, port, pathname, and query string when known. Do not use the deprecated `images.domains` option.

For the actual above-the-fold LCP image only, avoid lazy loading and use the installed Next.js version's recommended eager-loading hint. Do not prioritize multiple competing images.

Keep lazy loading for below-the-fold images. Add blur placeholders only when the project has a small valid `blurDataURL` or a static import provides one.

Do not use `unoptimized` to silence configuration or sizing problems. Use it only when the source format or deployment cannot use the optimizer, and state why.

**Done when:** application source has no remaining `<img>` and every `<Image>` has stable dimensions, useful `alt`, and correct responsive behavior.

### 4. Validate

Run the affected formatter, linter, type checker, tests, and production build using repository scripts.

Search application source again for `<img>`. Inspect changed pages at representative viewport sizes and confirm:

- images load without runtime configuration errors;
- aspect ratios and crops match the previous UI;
- no image causes layout shift;
- responsive images request appropriate sizes;
- only the real LCP image loads eagerly;
- decorative images use `alt=""`; informative images keep meaningful alt text.

Fix failures before finishing.

**Done when:** no application `<img>` remains and all affected checks pass.

## Report

State:

- files changed;
- `<img>` elements replaced;
- image configuration changed;
- validation commands and results;
- any image that could not use optimization and the exact reason.

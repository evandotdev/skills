---
name: ripgrep-find-func-clones
description: Hunt TypeScript function clones (same name and params in different files) and grill a shared module. Use when duplicate functions could become shared code, or when a monorepo likely has the same signature in more than one package.
---

# Ripgrep Find Func Clones

Hunt **clones** — functions with the same name and the same params, in different files — then grill the shared **module** those copies want to become. Stop after the grill. Extraction is a later session; tell the user the next command is `grill-with-docs`.

A clone is a same-signature copy, not a same-name collision, not a git clone, not a body-similarity match. For deepening (shallow modules, seams), the user types `improve-codebase-architecture`.

Call the Skill tool with "codebase-design" for **module**, **interface**, **seam**, **depth**, **leverage**, **locality**. Use those words in the survey and the grill.

## Process

### 1. Inspect this repo

Look at **this** working tree. Do not reuse folder names from another repo.

- **Tools** — `command -v rg` and `command -v node`. The parser needs Node 22+ (`--experimental-strip-types`). If either tool is missing, stop and say so.
- **Extensions** — start from `{.ts,.tsx,.cts,.mts}`. Keep an extension only when at least one matching file exists (`rg --files -g '*.tsx' -g '!*.d.ts'` and the same for the others). Always drop `*.d.ts`. If none survive, stop: this is not a TypeScript repo.
- **Packages** — read `pnpm-workspace.yaml`, `package.json` `workspaces`, then top-level directories that have their own `package.json`. Each of those is a package root, used only to rank clones.
- **Scan roots** — directories that actually hold kept-extension files. Prefer package roots that do. If that set is empty, use top-level source directories that do (`src/`, `app/`, `apps/`, `packages/`, and whatever else the tree shows). If that is still empty, scan `.`. `rg` honours gitignore.

**Done when:** kept extensions, scan roots, and package roots are written down, and each was read from this repo.

### 2. Hunt

Resolve [`scripts/group-functions.ts`](scripts/group-functions.ts) next to this `SKILL.md` (the skill directory, not the repo cwd). If the harness cannot see that path, copy the file to `$TMPDIR` and run the copy.

From the repo root, pipe `rg` into the parser. Build `-g` include globs from the kept extensions, and exclude globs from those same extensions (`!**/*.test.ts`, `!**/*.spec.tsx`, …) plus `!*.d.ts`, `!**/test/**`, `!**/__tests__/**`.

```bash
rg -n -A 12 \
  -g '*.ts' -g '*.tsx' \
  -g '!*.d.ts' \
  -g '!**/*.test.ts' -g '!**/*.test.tsx' \
  -g '!**/*.spec.ts' -g '!**/*.spec.tsx' \
  -g '!**/test/**' -g '!**/__tests__/**' \
  -e '^\s*(export\s+)?(async\s+)?function\s+\w+\s*\(' \
  -e '^\s*(export\s+)?const\s+\w+\s*=\s*(async\s*)?\(' \
  -e '^\s*(public|private|protected)\s+(static\s+)?(async\s+)?[A-Za-z_]\w*\s*\(' \
  -e '^\s+async\s+[A-Za-z_]\w*\s*\(' \
  <scan-roots> \
| node --experimental-strip-types --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
    <skill-dir>/scripts/group-functions.ts \
    --package-root <pkg>
```

Substitute `<scan-roots>` and each `--package-root <pkg>` from step 1. Pass one `--package-root` per package root. The four `-e` patterns and `-A 12` stay as written: the parser reads that `rg` format.

The parser prints **clones** only (same name+params, count ≥ 2), ranked by package **span** then hit count.

**Done when:** you have run that pipeline once and captured stdout, including the `CLONE_GROUPS=` line.

### 3. Present

Show the ranked list in chat. Each row: name, params, hit count, span, locations.

- `CLONE_GROUPS=0` — say none were found, and stop.
- 20 groups or fewer — the chat list is the whole survey.
- More than 20 — show the top 20 in chat. Write the full list to `$TMPDIR/function-clones-<timestamp>.md` (fall back to `/tmp`, or `%TEMP%` on Windows). Tell the user the absolute path.

Ask: "Which clone group should we grill?" Do not propose an interface yet.

**Done when:** the user can see every group (in chat, or chat plus the temp file), ranked with span first, and you have asked them to pick.

### 4. Grill the pick

Once they pick, call the Skill tool twice, for "grilling" and "codebase-design". Walk where the shared module should live and what its interface is. As terms crystallise, call the Skill tool with "domain-modeling".

Stop when location and interface are settled. Tell the user to type `grill-with-docs` on that idea before `implement`. Leave the copies in place.

**Done when:** one clone group has a proposed module location and interface, no files were extracted, and the user has the next command.

---
name: setup-pre-commit-antislop-typescript
description: Install Lefthook, Biome format, Oxlint with anti-slop, Knip, and gitleaks in a TypeScript repo. User-invoked.
disable-model-invocation: true
---

# Setup Pre-Commit Anti-Slop TypeScript

A **playbook** for the current JS/TS repo: Lefthook gates, Biome formats, Oxlint lints, Knip deletes unused exports, gitleaks scans secrets. Distinct from `setup-pre-commit` (Husky + Prettier).

You run this. Other skills may tell the human to type it; they must not start it.

## Recipe

Commands live in [`lefthook.yml`](./lefthook.yml) and the CI templates. Biome formats; Oxlint lints.

## Brownfield stops

Resolve every hit with the user before installing anything.

| Already in the repo | Action |
|---|---|
| Husky, `.husky/`, or `.pre-commit-config.yaml` | **Stop.** One hook runner. Do not add Lefthook beside it |
| Lefthook / `lefthook.yml` | Merge the missing commands from [`lefthook.yml`](./lefthook.yml). Do not add a second runner |
| Prettier as the formatter | **Stop and ask.** Do not stack Biome format on Prettier |
| ESLint | Leave their config. Do not add ESLint to the hook |
| Biome | Keep it. Turn the Biome **linter off** |
| Oxlint / Knip / gitleaks | Merge. Do not duplicate |

**Done when:** every row is classified, and every stop has an answer.

## Steps

### 1. Detect

- **Package manager** — `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `bun.lockb` / `bun.lock` → bun, else npm. Use it for every install and every command in the templates (`pnpm` is the example).
- **Workspaces** — `pnpm-workspace.yaml`, `package.json` `workspaces`, or an obvious `packages/` / `apps/` layout. Root `lefthook.yml`; one Biome format command per JS/TS package (`root: <pkg>`).
- **CI** — existing `.github/workflows/` vs `.gitlab-ci.yml` / `.gitlab/ci/`. If both, **ask** (GitHub if they shrug). If neither, use `origin` (`github.com` → Actions, `gitlab.com` → GitLab). If the host is unclear, **ask**, default GitHub.
- **gitleaks** — `command -v gitleaks`. If missing, keep writing the hook and print `brew install gitleaks` (or the platform equivalent).
- **Quarantine** — whether `.npmrc` already has `minimum-release-age`.

**Done when:** package manager, workspace list, CI target, gitleaks presence, and quarantine status are all known.

### 2. Quarantine, then install

If `.npmrc` lacks `minimum-release-age=10080`, add that key (keep any existing keys). Then install as devDependencies, through that gate:

```
lefthook @biomejs/biome oxlint @oxlint/plugins knip
```

Add a root `hooks:install` script: `lefthook install`. Do not add a `prepare` script.

**Done when:** `.npmrc` has the 7-day gate, those packages are in `devDependencies`, and `hooks:install` exists.

### 3. Anti-slop

Pin: `446268e5d15baa968eaec669ff65358d36ae6259` (committed **2026-08-14**, ages in **2026-08-21**).

**Warning:** this SHA is inside the 7-day `/security` quarantine. `/security` treats anything newer than 7 days as untrusted (`minimum-release-age=10080` for registry packages; the same age rule for vendored git). Say that warning to the user before running the add. Still install — do not skip.

```bash
npx skills add https://github.com/dmmulroy/anti-slop/tree/446268e5d15baa968eaec669ff65358d36ae6259 --skill install-anti-slop
```

Then open the installed `install-anti-slop` `SKILL.md` in this repo and follow it (vendor the plugin, enable every upstream rule, merge into `oxlint.config.ts`).

**Done when:** the quarantine warning was stated, and anti-slop is vendored and wired into Oxlint at that SHA.

### 4. Write configs

- Copy [`biome.json`](./biome.json) to the repo root, or to each JS/TS workspace package. Set `$schema` to the installed Biome version. Linter stays **off**.
- Copy [`oxlint.config.ts`](./oxlint.config.ts) to the repo root if none exists. Step 3 merges anti-slop into it.
- Copy [`lefthook.yml`](./lefthook.yml) to the repo root, or merge commands into an existing one. Substitute the detected package manager. For each workspace package, add a `biome-<name>` command with `root:` and the same glob/run as `biome-format`.
- If `typecheck` or `build` scripts are missing, drop `typecheck-build` from pre-push and CI and tell the user.

**Done when:** Biome linter is off, Lefthook has the recipe commands, Oxlint config exists, and missing scripts were omitted rather than invented.

### 5. Install hooks now

Run `lefthook install` (or the `hooks:install` script). Confirm `.git/hooks` now has non-`.sample` files (`pre-commit`, `pre-push`).

**Done when:** those hook files exist and are not samples.

### 6. CI

Write the non-writing variant. Do not overwrite an existing pipeline — add a dedicated workflow or jobs.

- GitHub → write `.github/workflows/quality.yml` from [`ci-github.yml`](./ci-github.yml)
- GitLab → merge [`ci-gitlab.yml`](./ci-gitlab.yml) into `.gitlab-ci.yml` or include it
- Substitute the package manager. Org GitHub repos need `GITLEAKS_LICENSE` for `gitleaks/gitleaks-action`; say so.

**Done when:** the chosen CI file exists and runs Oxlint, Biome check, Knip, `typecheck && build` (if those scripts exist), and gitleaks on the whole repo.

### 7. Finish

Smoke-test with `lefthook run pre-commit` if the tree is committable; a failure in gitleaks-missing or an empty staged set is acceptable to report rather than hide.

Do not commit. Tell the user to run `/commit`.

If gitleaks is missing from PATH, repeat the install line and add it to the repo README prerequisites when a README exists.

**Done when:** the user has been told to `/commit`, the anti-slop quarantine warning was stated, and every skip (missing gitleaks, missing scripts, CI ask) was stated.

---
name: commit
description: Create a Conventional Commits-style git commit from the current changes. Use when making git commits, writing a commit message, or when the user asks to commit.
disable-model-invocation: true
---

Create a git commit for the current changes using a concise Conventional Commits-style subject.

## Format

```text
<type>(scope): <description>
```

- `type`: (REQUIRED) Use one of fix, feat, build, chore, ci, docs, style, refactor, perf, test
- `scope`: (OPTIONAL) run the following command to see existing scopes:

```bash
git log --pretty=format:%s \
   | grep -Ei '^(feat|fix|build|chore|ci|docs|style|refactor|perf|test|revert)(\([^()]+\))?(!)?: ' \
   | sed -nE 's/^[^()]*\(([^()]+)\)(!)?: .*/\1/p' \
   | tr '[:upper:]' '[:lower:]' \
   | tr ',' '\n' \
   | sed -E 's/^[[:space:]]+|[[:space:]]+$//g' \
   | sed '/^$/d' \
   | sort \
   | uniq -c \
   | sort -nr \
   | head -n 50
```

- `description`: (REQUIRED) Short, imperative, <= 72 chars, no trailing period.

## Notes

- Always use imperative present tense
- Body is OPTIONAL. If needed, add a blank line after the subject and write a short paragraph.
- Do NOT include breaking-change markers or footers.
- Do NOT add sign-offs (no `Signed-off-by`).
- Only commit; do NOT push.
- If it is unclear whether a file should be included, ask the user which files to commit.
- When working in a repository with many changes, ask the user for confirmation on whether to commit unrelated changes as well.
- Treat any caller-provided arguments as additional commit guidance. Common patterns:
  - Freeform instructions should influence scope, summary, and body.
  - File paths or globs should limit which files to commit. If files are specified, only stage/commit those unless the user explicitly asks otherwise.
  - If arguments combine files and instructions, honor both.
- Always prefer splitting commits into smaller, narrower scopes.

## Steps

1. Infer from the prompt if the user provided specific file paths/globs and/or additional instructions.
2. Check git hooks. List files in `.git/hooks` that are not `*.sample`. If that list is empty:
   - If `lefthook.yml` exists at the repo root, stop and ask the user to run `hooks:install` or `lefthook install`.
   - Otherwise stop and tell the user to run a setup skill that installs git hooks. Do not name a specific setup skill.
   Do not commit until they have installed hooks or explicitly told you to continue without them.
3. Review `git status` and `git diff` to understand the current changes (limit to argument-specified files if provided). Note that git diff will not include untracked files.
4. Run the following command to see commonly used scopes.

```bash
git log --pretty=format:%s \
   | grep -Ei '^(feat|fix|build|chore|ci|docs|style|refactor|perf|test|revert)(\([^()]+\))?(!)?: ' \
   | sed -nE 's/^[^()]*\(([^()]+)\)(!)?: .*/\1/p' \
   | tr '[:upper:]' '[:lower:]' \
   | tr ',' '\n' \
   | sed -E 's/^[[:space:]]+|[[:space:]]+$//g' \
   | sed '/^$/d' \
   | sort \
   | uniq -c \
   | sort -nr \
   | head -n 50
```

5. If there are ambiguous extra files, ask the user for clarification before committing.
6. Stage only the intended files (all changes if no files specified).
7. Run `git commit -m "<subject>"` (and `-m "<body>"` if needed).

## Examples

- docs: update readme
- docs(coding-agent): update readme
- docs(coding-agent): update changelog
- fix(api): serialize json

## What it does

`commit` turns the current working tree into one or more Conventional Commits-style git commits. It reads `git status` and `git diff`, infers type and scope from the repo's recent messages, then stages and commits. It never pushes.

The subject is the whole artifact: `<type>(scope): <description>` in imperative present tense, no trailing period, no breaking-change markers, no sign-off. A body is optional. Unrelated files stay out unless you say otherwise, and a large mixed tree is split into narrower commits rather than one dump.

## When to reach for it

Type `/commit`, or the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) reaches for it automatically when a task fits.

| Your situation                                | Skill                                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------------- |
| Changes are ready and you want them committed | This one                                                                              |
| A spec or ticket still needs building         | [implement](https://aihero.dev/skills-implement), which commits at the end of the run |
| You want the diff reviewed before it lands    | [code-review](https://aihero.dev/skills-code-review)                                  |
| Git has stopped on merge or rebase conflicts  | [resolving-merge-conflicts](https://aihero.dev/skills-resolving-merge-conflicts)      |

## Conventional subjects, narrow scopes

The leading word is **narrow**. The skill would rather write three small commits than one that mixes a fix, a rename, and a README tweak. Scope comes from history (`feat(api)`, `docs(coding-agent)`), not from inventing a new vocabulary per commit. Paths or globs you pass in limit what gets staged; freeform instructions shape the subject and body.

## Common questions

**Does it push?**

No. Commit only. Push stays a separate, explicit request.

**Will it commit files I'm unsure about?**

Not if it notices. Ambiguous extras and unrelated changes get a question before anything is staged. If you name files, only those files go in.

**Is this the same as `/implement`'s closing commit?**

No. [implement](https://aihero.dev/skills-implement) builds work and then commits as its last beat. This skill is the commit step on its own — local changes that are already written, with no build loop around them.

## It's working if

- The subject matches Conventional Commits (`feat`, `fix`, `docs`, …) and reads as an imperative.
- Unrelated files were left unstaged, or you were asked about them first.
- `git log -1` shows the new commit and `git status` is clean for the files you meant to include.
- Nothing was pushed.

## Where it fits

A reach-for-it-anytime standalone at the end of a local change, not a chain step. Its neighbours are [implement](https://aihero.dev/skills-implement), which already commits after a build, and [code-review](https://aihero.dev/skills-code-review), which you run against a fixed point when you want the diff judged before or after it lands. [ask-matt](https://aihero.dev/skills-ask-matt) is the map for what runs before this.

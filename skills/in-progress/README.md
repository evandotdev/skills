# In Progress

Beta. These skills are public on purpose — try them and tell me what breaks. They're excluded from the plugin and the top-level README until they graduate to a stable bucket, they get no docs pages, and they can change or disappear without warning.

The plugin won't give you these. Install one directly:

```bash
npx skills@latest add mattpocock/skills --skill=<name>
```

- **[loop-me](./loop-me/SKILL.md)** — Grill yourself into implementable workflow specs over multiple sessions, using the current directory as a stateful workspace. User-invoked.
- **[writing-beats](./writing-beats/SKILL.md)** — Shape an article as a journey of beats, choose-your-own-adventure style. Pick a starting beat, write only that beat, then pivot to the next, until the article reaches a natural end.
- **[writing-fragments](./writing-fragments/SKILL.md)** — Grilling session that mines you for fragments — heterogeneous nuggets of writing — and appends them to a single document as raw material for a future article.
- **[writing-shape](./writing-shape/SKILL.md)** — Take a markdown file of raw material and shape it into an article paragraph by paragraph, arguing format choices at each step.
- **[claude-handoff](./claude-handoff/SKILL.md)** — Hand the current conversation off to a fresh background agent that picks up the work immediately, seeded with a handoff summary via `claude --bg`. User-invoked.
- **[setup-ts-deep-modules](./setup-ts-deep-modules/SKILL.md)** — Wire dependency-cruiser into a TypeScript repo so each package is a deep module — implementation hidden in subfolders, reachable only through its entry-point files, tests exercising it through those. User-invoked.
- **[setup-pre-commit-antislop-typescript](./setup-pre-commit-antislop-typescript/SKILL.md)** — Install Lefthook, Biome format, Oxlint with anti-slop, Knip, and gitleaks in a TypeScript repo. User-invoked.
- **[ripgrep-find-func-clones](./ripgrep-find-func-clones/SKILL.md)** — Find TypeScript function clones (same name and params) and grill a shared module. Does not extract. Model-invoked.
- **[reddit-market-research](./reddit-market-research/SKILL.md)** — Browse Reddit with an authenticated browser, fan out one subagent per subreddit, and collect pain points, products, pros/cons, and pricing with comment permalinks. Model-invoked. Experimental.

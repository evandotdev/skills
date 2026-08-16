## What it does

`security` puts a 7-day quarantine on new package versions, then reviews the repo for secrets, injection, authz gaps, and dependency risk. It reports findings with severity and a smallest-safe patch plan. It does not rip out controls you meant to have.

The defining constraint is **quarantine first**. Before any install, it wants an age gate so a freshly published malicious package cannot resolve — `exclude-newer` for uv, `minimum-release-age` for npm-family managers, or the same policy in CI if the client cannot enforce it.

## When to reach for it

Type `/security`, or the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) reaches for it automatically when a task fits.

| Your situation | Skill |
| --- | --- |
| About to install packages, or starting a project | This one |
| You want a diff judged against standards and spec | [code-review](https://aihero.dev/skills-code-review) |
| Something is already broken and you need a tight reproduce loop | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |

## Quarantine, then the smallest patch

The leading word is **quarantine**. A version published in the last seven days is treated as untrusted until it ages in. After that, the sweep is a risk pass — secrets, SSRF, path traversal, authz — then a patch plan ordered by exploitability, not a broad refactor.

## Common questions

**Does this replace a dedicated security audit?**

No. It is a fast posture check plus install guardrails. It will not replace a scoped pentest or a full dependency CVE program.

**Will it delete security controls that look unused?**

Not without an explicit ask. Intentional controls stay until you approve removing them.

**What if my package manager has no age-gate setting?**

The skill still wants the 7-day policy. Put it in CI before install rather than skipping the quarantine.

## It's working if

- New installs cannot resolve packages published in the last 7 days, or CI rejects them.
- Findings arrive as a table with severity, exploitability, and a fix.
- The patch plan is small and ordered, not a rewrite.
- Residual risks are named instead of implied to be zero.

## Where it fits

A reach-for-it-anytime standalone around installs and hardening, not a chain step. Its neighbours are [code-review](https://aihero.dev/skills-code-review), which judges a diff rather than the dependency surface, and [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs), which takes over when a live incident needs a reproduce loop. [ask-matt](https://aihero.dev/skills-ask-matt) is the map for what runs before this.

---
name: security
description: >-
  Add supply-chain guardrails before installing packages, then review and
  harden for secrets, injection, authz gaps, and dependency risk. Use when
  starting a project, installing dependencies, doing a security review,
  threat modeling, or incident-response-style triage.
---

# Security

Use this skill when starting a new project, or the task involves security review, hardening, threat modeling, dependency risk reduction, or incident-response-style triage.

## Goals

- Add supply-chain guardrails before installing any packages, to reduce exposure to freshly published malicious packages.
- Prioritize fixes by exploitability and impact.
- Provide concrete remediation steps.

## Default Workflow

1. **Scope and context**
   - Identify language(s), package manager(s), runtime surface, auth boundaries, and data sensitivity.
2. **Fast risk sweep**
   - Check for secrets, unsafe deserialization, command injection, SSRF, path traversal, authz gaps, and insecure defaults.
3. **Dependency posture**
   - Audit direct + transitive dependencies.
   - Add package-age guardrails (see below).
4. **Fix plan**
   - Propose smallest safe patch set first.
   - Include verification steps and regression checks.
5. **Report**
   - Summarize findings with severity, impact, exploit path, and patch status.

## Supply-Chain Guardrails (New Package Quarantine)

### Python (uv)

Add this to `pyproject.toml`:

```toml
[tool.uv]
exclude-newer = "7 days"
```

Or add this to `~/.config/uv/uv.toml`:

```toml
exclude-newer = "7 days"
```

This prevents `uv` from resolving package versions released within the last 7 days.

### TypeScript / JavaScript

For package managers that read `.npmrc` (for example pnpm), add a minimum publish-age gate so very new package versions are excluded:

```ini
minimum-release-age=10080
```

`10080` minutes = 7 days.

If the active package manager does not support this key, enforce an equivalent 7-day age policy in CI before install.

## Output Format

When reporting results, always include:

- Findings table: `severity | file | issue | exploitability | fix`
- Patch plan in execution order
- Commands used for validation
- Residual risks

## Constraints

- Do not remove intentionally designed security controls without explicit user approval.
- Prefer deterministic, reproducible changes.
- Avoid broad refactors during urgent remediation unless necessary to eliminate risk.

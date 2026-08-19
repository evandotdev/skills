---
name: codex-handoff
description: Hand the current conversation off to a fresh Codex App thread that picks up the work immediately.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write a handoff summary of the current conversation so a fresh agent can continue the work. Instead of saving it, launch a new Codex App thread seeded with the summary as its prompt.

This skill only works in the Codex App. If `create_thread` is not in your tool list, search for Codex App thread tools (`create_thread`, `set_thread_title`, `list_projects`). If they are still unavailable, tell the user this skill only works from the Codex App and stop.

Launch with `create_thread`: same project (`projectId` from `list_projects` if needed), environment `local` so it starts in the current working directory, summary as `prompt`. Then `set_thread_title` with a descriptive name (e.g. "Fix login bug") — it sets the display name in the sidebar. The new thread starts immediately; the user manages it from the Codex App sidebar.

Always set a descriptive title via `set_thread_title` — it is the name shown in the thread list and sidebar.

Include a "suggested skills" section in the summary, naming which skills the next agent should call the Skill tool for.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information — the summary becomes the agent's prompt.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the summary accordingly.

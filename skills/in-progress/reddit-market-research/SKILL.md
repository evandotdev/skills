---
name: reddit-market-research
description: >-
  Browse Reddit with an authenticated Cursor browser or Codex Chrome-connected
  browser to collect market research. Identifies relevant and adjacent
  subreddits, then launches parallel subagents to extract pain points, products
  used, pros/cons, and pricing models from posts and comments. Use when the
  user asks for Reddit market research, competitor research on Reddit,
  subreddit pain-point analysis, VOC from Reddit, or invokes
  /reddit-market-research.
---

# Reddit Market Research

Collect primary user evidence from Reddit for topic `$ARGUMENTS`. If `$ARGUMENTS` is empty, use the topic in the user message. Stop and ask if the topic is still missing.

This skill is **read-only**. Do not post, comment, vote, message, subscribe, or change Reddit account state.

## Browser

Use an authenticated browser. Do not use WebFetch, curl, or anonymous HTTP as a substitute.

1. Prefer Codex Chrome connected to the user's Chrome profile (logged-in Reddit session).
2. Else use Cursor's browser MCP (`cursor-ide-browser`).
3. If neither is available, stop and tell the user which browser to connect.

Before collection, open Reddit and confirm the session is logged in. If you see a login wall, CAPTCHA, block page, or empty gated feed, stop and ask the user to log in in that browser, then continue.

Browser tool steps: [reference.md](reference.md).

## Workflow

Copy this checklist and track it:

```text
Reddit market research:
- [ ] 1. Confirm authenticated browser
- [ ] 2. Identify relevant and adjacent subreddits
- [ ] 3. Launch one parallel subagent per subreddit
- [ ] 4. Collect post/comment evidence
- [ ] 5. Merge into the findings table
```

### 1. Identify subreddits

Find communities for the topic, then adjacent ones (competitor products, jobs-to-be-done, "alternatives to X", related-communities sidebar, "also posted in r/…").

Cap the working set at **6–10** subreddits. Prefer active, on-topic communities over huge generic ones unless the generic subreddit has a strong search hit.

List the selected subreddits and why each is in scope **before** launching subagents.

### 2. Parallel subagents

Spin up parallel agents / subagents to browse each one of these subreddits.

- Launch **one subagent per selected subreddit in a single turn**.
- Each subagent must use the same authenticated browser path as the parent.
- If the host cannot give subagents a browser, the parent must open **one tab per subreddit** and collect in parallel. Do not serialize unless the browser allows only one tab.

Give each subagent: topic, `r/<name>`, search queries, collection bounds, and the output table below.

### 3. Per-subreddit collection

For each of the subreddits, analyze user posts and comments and collect data on their pain points, existing products they use, pros/cons of why they use these products, the pricing model for them.

Bounds per subreddit:

- Search first (`restrict_sr=1`), then open the highest-signal threads (complaints, "what do you use", alternatives, pricing, churn).
- Cover **8–15 threads** or stop after **~20 evidence rows**, whichever comes first.
- Prefer comments with concrete product names over vague venting.
- Record only what the comment/post states. If pricing is absent, write `not stated`. Do not fill prices from memory.

Each row must cite a **comment permalink** (or the post permalink if the evidence is the post body).

### 4. Findings format

Format your findings in the format:

Pain point | product used | pros | cons | pricing model | link to comment

Use a markdown table with that exact header. One row per evidence item. Group rows by subreddit. After the tables, add a short synthesis: recurring pain points, product clusters, pricing patterns, and gaps (claims with no pricing or no named product).

## Subagent prompt

```text
Topic: <topic>
Subreddit: r/<name>
Read-only. Do not post, vote, comment, or message.

Use the authenticated browser already chosen by the parent. Confirm Reddit is logged in.

1. Search inside r/<name> for the topic and adjacent jobs-to-be-done.
2. Open 8–15 high-signal threads (pain, alternatives, pricing, "what do you use").
3. Extract evidence from posts and comments only.

Return markdown tables using this exact header:

Pain point | product used | pros | cons | pricing model | link to comment

Rules:
- One row per distinct evidence item.
- `product used` is a named product, or `none named`.
- `pricing model` is only what the thread states (subscription, one-time, freemium, usage, free, not stated).
- `link to comment` must be a permalink to that comment (or the post if the body is the evidence).
- Skip ads, automod, and off-topic threads.
- If the subreddit is empty, private, or blocked, return that status and zero rows.
```

## Hard rules

- Do not invent products, prices, or quotes.
- Do not scrape unbounded listings or infinite-scroll the whole subreddit.
- If four browser actions fail with no new evidence, stop that path and report the blocker.

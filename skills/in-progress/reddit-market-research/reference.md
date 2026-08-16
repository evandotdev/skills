# Browser and Reddit reference

Read this when choosing tools or building Reddit URLs.

## Browser selection

| Host | When to use | How |
|------|-------------|-----|
| Codex Chrome | Chrome extension is connected; user is logged into Reddit in Chrome | Drive the user's Chrome profile. Work across tabs in parallel. Do not take over the user's active tab when a background tab works. |
| Cursor browser | Codex Chrome is unavailable | Use `cursor-ide-browser`. `browser_tabs` list → `browser_navigate` (omit `position` for background tabs) → `browser_lock` → snapshot/click/scroll → `browser_lock` unlock when fully done. |

Prefer Codex Chrome when both exist. Reddit often hides comments or search behind the logged-in session.

Do not use the Codex in-app browser or Computer Use for this skill. Those sessions are not the user's Reddit login.

### Cursor lock order

1. Existing tab: lock first, then interact.
2. New tab: navigate, then lock, then interact.
3. Unlock only after all browser work for the turn is done.

If login, passkey, CAPTCHA, or a block page appears, stop and ask the user to take over that browser.

## Reddit URLs

Prefer `old.reddit.com` when the page loads; fall back to `www.reddit.com`.

Subreddit discovery:

```text
https://old.reddit.com/search?q=<topic>&type=sr
https://www.reddit.com/search/?q=<topic>&type=sr
```

In-subreddit search (sort by comments, last year):

```text
https://old.reddit.com/r/<sub>/search?q=<query>&restrict_sr=1&sort=comments&t=year
```

Useful query fragments to combine with the topic: `alternative`, `vs`, `pricing`, `expensive`, `switched from`, `hate`, `looking for`, `recommend`.

Thread and comment permalinks look like:

```text
https://www.reddit.com/r/<sub>/comments/<id>/<slug>/
https://www.reddit.com/r/<sub>/comments/<id>/<slug>/comment/<comment_id>/
```

Always store the `www.reddit.com` permalink in the table, even if you browsed `old.reddit.com`.

## Session check

A logged-in session usually shows the user menu / avatar and does not force `/login`. A logged-out session shows Log In / Sign Up and often truncates comments.

Related communities: subreddit sidebar, "Also visit", wiki, and comments that name other `r/` communities.

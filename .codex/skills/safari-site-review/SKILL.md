---
name: safari-site-review
description: Use when you need to troubleshoot or visually verify this static portfolio in Safari, especially for responsive layout issues, terminal interactions, cache-busting problems, or local GitHub Pages preview behavior. Start the local preview, bring up safaridriver, drive Safari with local WebDriver curl calls, and validate desktop or mobile behavior before concluding.
---

# Safari Site Review

Use this skill for browser-facing work in this repo when static inspection is not enough.

## When to use it

- Visual layout or spacing changes need real Safari rendering.
- Terminal interactions need live verification.
- Safari appears to be serving stale JS or CSS.
- A change behaves differently on desktop and mobile widths.

## Workflow

1. Make sure the local preview is running on `http://127.0.0.1:8000`.
2. Make sure Safari WebDriver is enabled once with `safaridriver --enable`.
3. Start `safaridriver -p 4444`.
   In Codex, this may require escalated permissions because browser automation is usually blocked inside the sandbox.
4. Check readiness with `curl --max-time 3 -s http://127.0.0.1:4444/status`.
5. Create a Safari session, set an explicit viewport, and load a cache-busted local URL.
6. Use `/execute/sync` for targeted DOM checks and interaction tests.
7. Close the session when done.

## Repo-specific checks

- If JS changed, confirm `js/scripts.min.js` matches `js/scripts.js` and bump the script query string in `index.html`.
- For terminal changes, verify the actual command flow in Safari instead of trusting source inspection.
- Prefer these viewport sizes unless the task clearly needs something else:
  - Desktop: `1440x1180`
  - Mobile: `390x844`

## Read next

- For exact `curl` payloads and example DOM snippets, read [references/webdriver-recipes.md](references/webdriver-recipes.md).

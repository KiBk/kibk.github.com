# Project summary
- Static personal portfolio for Kirill Bykov forked from Ryan Fitzgerald's devportfolio template; still a single-page site (`index.html`), but now with a responsive split hero that foregrounds AI-assisted engineering workflows, an always-open client-side portfolio terminal styled as a guest shell on `kibk.net` that supports `ls`/`pwd`/`cat`/`open`, tab completion, an owner-only `secret` target unlocked via `su kibk` or `sudo su`, and docking into a floating mini-terminal after `cd <section>` navigation, richer project cards with expandable details, sections for About, Experience, Education, Projects, Skills, Languages/Personal Achievements, and a Formspree-backed contact form, plus a root `.nojekyll` file so GitHub Pages serves the site as raw static content. The Skills section currently emphasizes genAI workflows, evaluation, agents, and prompt engineering alongside core systems and hardware tooling.
- Frontend stack: Bootstrap grid for legacy structure, Font Awesome icons, Google Fonts (IBM Plex Sans and IBM Plex Mono), stylesheet source in `scss/styles.scss` mirrored to `css/styles.css`, and runtime JavaScript in `js/scripts.min.js` authored alongside `js/scripts.js`; images live under `images/`.
- Upstream reference: https://github.com/RyanFitzgerald/devportfolio

# Maintenance
- If you change site content, layout, assets, or build pipeline (Sass/JS/Gulp), update the Project summary above to reflect the new state and keep the upstream reference accurate.

# Safari Preview
- For local browser review, serve the repo root with `python3 -m http.server 8000` and open `http://127.0.0.1:8000`.
- On a fresh machine setup, enable Safari WebDriver once from a user terminal with `safaridriver --enable`. If macOS asks for elevation, run `sudo safaridriver --enable`.
- If Safari automation is not available, open Safari and make sure remote automation is allowed in the Develop menu if that option is present on the system.
- Starting `safaridriver` from the Codex sandbox may exit immediately even when Safari is configured correctly. Run `safaridriver -p 4444` outside the sandbox or with escalated permissions when using Codex tooling.
- Confirm the driver is ready with `curl --max-time 3 -s http://127.0.0.1:4444/status`. A healthy response includes `"ready":true`.
- Create a session with:
  `curl --max-time 10 -s -X POST http://127.0.0.1:4444/session -H 'Content-Type: application/json' -d '{"capabilities":{"alwaysMatch":{"browserName":"safari"}}}'`
- Once a session exists, drive the page with local `curl` calls to `/session/<id>/url`, `/window/rect`, and `/execute/sync`. In Codex, these localhost WebDriver calls may also need escalated permissions even though they are only talking to the local Safari driver.
- Close the temporary browser session after verification with:
  `curl --max-time 10 -s -X DELETE http://127.0.0.1:4444/session/<id>`

# Project summary
- Static personal portfolio for Kirill Bykov forked from Ryan Fitzgerald's devportfolio template; still a single-page site (`index.html`), but now with a responsive split hero that foregrounds AI-assisted engineering workflows, an always-open client-side portfolio terminal styled as a guest shell on `kibk.net` that can dock into a floating mini-terminal after `cd <section>` navigation, richer project cards with expandable details, sections for About, Experience, Education, Projects, Skills, Languages/Personal Achievements, and a Formspree-backed contact form, plus a root `.nojekyll` file so GitHub Pages serves the site as raw static content.
- Frontend stack: Bootstrap grid for legacy structure, Font Awesome icons, Google Fonts (IBM Plex Sans and IBM Plex Mono), stylesheet source in `scss/styles.scss` mirrored to `css/styles.css`, and runtime JavaScript in `js/scripts.min.js` authored alongside `js/scripts.js`; images live under `images/`.
- Upstream reference: https://github.com/RyanFitzgerald/devportfolio

# Maintenance
- If you change site content, layout, assets, or build pipeline (Sass/JS/Gulp), update the Project summary above to reflect the new state and keep the upstream reference accurate.

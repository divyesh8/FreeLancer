# Form / Field

A complete static studio website, adapted from the existing HTML/CSS/JavaScript project. No framework migration or runtime dependencies. Form / Field is a proposed identity; the portfolio is explicitly original demonstration work, not client work.

## Run

Requires Node.js 20+ and npm. No installation is needed.

```powershell
npm run check
npm run build
npm run dev
```

Open http://127.0.0.1:4173. If that port is occupied:

```powershell
$env:PORT = '4174'
npm run dev
```

The development command generates the case-study pages before serving. Rebuild after editing project records, and reload the browser after changes. `node scripts/serve.mjs --dist` previews the production output.

## Deploy

1. Replace the content and configure contact delivery described below.
2. Run `npm run check` and `npm run build`.
3. Upload the **contents of dist/** to a static host, or connect this repository with build command `npm run build` and publish directory `dist`.
4. Configure the host to serve `404.html` with HTTP 404 for unknown URLs. Do not enable a single-page-app fallback.
5. Use HTTPS, configure your domain, and test the form against the real provider. No hosting credentials or public deployment are included in this local repository task.

## Main files

- `index.html`: semantic homepage, editable team/story placeholders, services, process and contact form.
- `styles.css`: visual identity, responsive layouts and CSS/SVG motion.
- `app.js`: canvas ribbon, cursor, motion preference, navigation, scroll timeline, process controls and form.
- `site.config.js`: project narratives, public email, social links and delivery endpoint.
- `scripts/build.mjs`: generates three standalone case studies, custom 404 and production output.
- `scripts/serve.mjs`: local development/production-preview server, supports the PORT environment variable.
- `work/*.html` and `404.html`: generated pages; edit the build template or configuration instead.

## Content before launch

Replace the proposed studio name in the HTML, build template, metadata and favicon. Replace bracketed facts in `index.html`, including team names/roles, founding year and milestones. Confirm proposed services and working process. Update the project records in `site.config.js` and their homepage artwork/copy together. Do not remove demonstration labels until you supply genuine projects. Add approved professional links to `site.socials` and an actual address to `site.email`. No team photos, testimonials, client logos or results are fabricated.

## Contact delivery

No endpoint or email was provided. The default form validates required fields, email, length and whitespace. It then clearly reports **not sent**, and offers a local text-file download. No personal information is stored in localStorage or sent anywhere in this mode.

Set `site.contactEndpoint` to an HTTPS form service or server endpoint accepting a JSON POST with `name`, `email`, `projectType`, `budget`, `description`, and `website` (honeypot). The endpoint must permit your origin via CORS, validate every field server-side, reject filled honeypots, enforce rate limits/body-size limits, and return 2xx only after accepting delivery. Return non-2xx for failure. Keep provider keys on the server; never put secrets in site.config.js. No secret environment variables are required by the static frontend.

The configured mode includes disabled/pending submit state, 15-second timeout, success feedback and error feedback that preserves entries. These real-provider success/error paths require integration testing once an endpoint exists. Native email links are enabled only after a verified address is configured.

## Motion and accessibility

Original continuous 2D canvas ribbon; staggered type and artwork entrances; project mask reveals; SVG service line drawing; scroll-linked timeline; flowing process signal; magnetic CTA and contextual cursor. Native scrolling is preserved. Offscreen canvas rendering is skipped. Fine-pointer devices receive the custom core/ring only while supported and active. Native cursors return over form controls, on pointer exit, or when reduced motion is enabled. Reduced motion also disables nonessential CSS/SVG motion. The Motion control saves a local preference and respects the system setting.

Navigation, service disclosures, process controls, case studies and form use native links/buttons/inputs, focus styling, labels, skip links and live status announcements. Without JavaScript, content, projects and navigation remain accessible; enhanced form delivery needs JavaScript.

## Verification performed

- `npm run check`: passed JavaScript syntax checks. This project has no TypeScript or configured lint task.
- `npm run build`: passed; generated all pages and verified homepage anchor targets.
- Browser inspected at 1440×900, 768×1024 and 390×844; no horizontal document overflow observed.
- Verified mobile menu open/close via navigation, service disclosure, all three case-study navigation paths and contact CTA.
- Verified required-field rejection and valid brief's honest unconfigured-delivery state.
- Captured browser error/warning logs were empty on inspected pages.
- Browser system reduced motion was enabled: static fallback and disabled motion control verified. Live animation/custom-cursor feel could not be visually verified under this environment setting; test with reduced motion off before launch.
- Real delivery and public deployment remain unconfigured.

## Cinematic motion update

`motion.js` now supplies shared navigation shutters on the homepage and case studies, large masked heading entrances, project image perspective reveals, hero scroll parallax, and a sticky SVG character scene. Spark, Dot, and Block float, blink, wave, follow the pointer with their eyes, and jump on click/keyboard activation. Character loops pause offscreen and when the tab is hidden.

The persistent bottom-right control now allows an explicit full-motion choice even when the OS requests reduced motion. System settings remain the default until the visitor makes that choice. Pause motion restores the static accessible experience. The preference is shared across project pages via `form-field-motion`; no OS setting is changed.

Validation for this update: syntax/build passed; browser verified full-motion opt-in, navigation to a case-study page, character jump class, pause removing animation, and mobile layout without horizontal document overflow. No browser error/warning logs were observed.

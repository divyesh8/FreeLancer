# FORM / FIELD

Static creative-studio website, redesigned in place. HTML, CSS, native JavaScript modules, CSS/SVG characters and a custom canvas field. No runtime framework or animation-library dependency. Vercel configuration is preserved.

## Run and deploy

Requires Node.js 20+. Run `npm run dev` and visit http://127.0.0.1:4173. If the port is in use, PowerShell: `$env:PORT='4175'; npm run dev`.

- `npm run check`: JavaScript syntax checks.
- `npm run build`: regenerate portfolio/case studies/404 and copy static output into `dist`.
- `npm install` then `npm run test:browser`: headless Edge interaction suite. Start the site on port 4175 first. Microsoft Edge must be installed. Test reports/screenshots are written to ignored `qa/`.
- Vercel: build command `npm run build`, output directory `dist`, framework preset Other. Deploy the updated repository through its existing Vercel Git integration or run `npx vercel --prod` after authenticating/linking the correct project. No deployment was performed during this redesign.
- Other static hosts: publish the contents of `dist/`, with `404.html` as the unknown-route response. No SPA fallback.

## Audit and redesign

The old opening separated the message from its graphic; equal-sized project cards flattened the work; most sections repeated the same entrance; the characters felt detached from the studio story. The redesign creates one interlaced field behind monumental type, a light editorial portfolio with asymmetric proportions, a drawing story line, characters within About, and a process diagram that assembles as stages are selected. The form and genuine content are retained.

Two refinement passes tightened hero word spacing/process typography, then checked motion timing, cursor behavior, default preferences, mobile layouts and reduced motion. The deployed site was captured at desktop/tablet/mobile sizes. The external references opened in the headless browser but their screenshots remained on loading screens, so their complete live motion could not be compared reliably.

## Main files

- `index.html`: homepage sections and editable studio information. The marked portfolio region is generated.
- `redesign.css`: new composition, editorial layouts, stage diagrams, mobile styles and gentle-motion rules.
- `styles.css`: original shared artwork and interaction foundations.
- `app.js`: continuous interlaced canvas field, pointer/cursor, service/process controls, scroll timeline and contact handling.
- `motion.js`: default motion preference, page shutters, masked type, scroll choreography and interactive SVG cast.
- `site.config.js`: project narratives, optional thumbnail/images, services, technologies, links and contact configuration.
- `project-art.js`: shared original CSS artwork for demonstration projects.
- `scripts/build.mjs`: portfolio, standalone case studies and production output.
- `scripts/qa.mjs`: repeatable browser interaction and responsive checks.

Add a project record to `site.config.js`; the build generates its card and detail page. Set `thumbnail` to an optional site-relative asset path, `images` to `{src, alt}` records (use root-relative `/assets/...` paths for detail images), `url` to its verified live URL, and `isConcept` appropriately. Put assets in `assets/`; the build copies them. With no thumbnail, the original code-generated composition is used. Update `social-preview.png` and social metadata if the domain/design changes.

## Motion

New visitors get motion automatically. The persistent Pause control stops it; the explicit choice persists under `form-field-motion-v2`. Previous experimental preference keys are not reused. OS reduced-motion requests select a gentle presentation: no large travel, character loops, cursor override, project tilt, or fast canvas movement. No OS settings are modified.

Four distinct sequences: interlaced hero fields with pointer/scroll response; perspective/mask project previews with project-specific hover artwork; scroll-drawn origin timeline; assembling process diagram. Characters blink, wave, float, track the pointer, and jump on click or keyboard activation. Loops pause offscreen/when hidden. Native scrolling, links, semantic buttons, form labels, focus states, and explicit Pause remain available.

## Honest content and contact blocker

FORM / FIELD remains provisional. All three projects are visibly original concepts, not client engagements. Replace bracketed names, years and milestones in `index.html`, confirm services/workflow, and supply verified projects before public business launch. No awards, clients, testimonials, or results are invented.

There are no delivery credentials or verified email/social addresses in the repository. Until configured, form validation offers a downloadable brief and explicitly says it has **not been sent**. No submitted personal information is sent or persisted in this mode.

Set public `site.email`, `site.socials` and HTTPS `site.contactEndpoint` in `site.config.js`. The endpoint must accept JSON fields `name`, `email`, `projectType`, `budget`, `description`, `website` (honeypot); permit your domain via CORS; validate lengths/email server-side; reject filled honeypots; apply rate/body-size limits; and return 2xx only after accepting delivery. Keep provider keys server-side. The client has timeout, pending, success and error feedback and preserves entries on failure. Real delivery needs an integration test after configuration.

## Checks actually executed

`npm run check` and `npm run build` passed. Headless Microsoft Edge verified fresh-session default motion, process diagram state, service disclosure, changing character transforms and jump response, desktop custom cursor activation, pause/resume, curtain destination/focus, case-study navigation, required form validation, unconfigured delivery feedback, brief download, mobile menu, 768px/390px widths without document overflow, reduced-motion character suppression, and custom 404. No JavaScript errors or unexpected console errors were observed. Captures include 1440px desktop, 768px tablet and 390px mobile. A final link/asset verification covers all generated pages.

Real contact delivery and public deployment remain unconfigured/unperformed. No TypeScript or lint task applies to this plain-JavaScript project.

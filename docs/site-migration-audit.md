# CMYKForge site migration audit

Audit date: 2026-07-21  
Repository: `graysonclay/CMYKForge-Website`  
Migration branch: `chatgpt-sites-migration`  
Live origin at audit time: `https://cmykforge.org` on GitHub Pages

## Executive summary

CMYKForge is a well-structured static site built from handwritten HTML, CSS, and browser JavaScript. It does not need to be rebuilt. The migration keeps every public page and canonical URL, keeps the GitHub Pages deployment as the rollback host, and adds a small Cloudflare Worker-compatible wrapper for ChatGPT Sites.

The existing site already has unusually strong SEO and accessibility fundamentals for a static product site: semantic landmarks, one H1 on each indexable page, self-hosted fonts, responsive layouts, reduced-motion handling, keyboard-aware components, canonical URLs, social metadata, JSON-LD, a sitemap, robots rules, image dimensions, a custom 404, and deterministic validation tooling.

The most important findings were:

- The GitHub Pages workflow uploaded the repository root even though the documented production build writes a smaller, minified `_site/` artifact. The migration branch corrects the workflow without removing GitHub Pages.
- Several Standard-page sentences described STL and OBJ export as included even though the compatibility table correctly marked them as planned. The migration makes 3MF “in active testing” and STL/OBJ “planned” consistently.
- The site did not provide one concise, explicit distinction between current development capabilities, beta validation targets, and planned features. A status section now does so on the home and Standard pages.
- The static output is not directly a Sites deployment artifact. Sites requires a compatible server entrypoint and asset manifest. The migration adds a thin Worker that serves the existing built files, implements the legacy redirect, redirects `www` to the canonical apex when both domains are connected, returns the existing custom 404 with a real 404 status, and adds conservative security headers.
- No HTML Search Console verification tag exists. Ownership is currently protected by the live DNS TXT record `google-site-verification=980nAsy4Kg2NtQ_K8gDlHiuepJC09QViSUW6B3BELL0`; that record must remain unchanged.
- No Google Analytics, Tag Manager, tracking pixel, cookie banner, or site-owned analytics script is present. ChatGPT Sites has its own platform analytics view, but that does not replace an existing GA property because none was found.
- The legal pages are clearly marked as drafts and `noindex`. They must remain accessible and excluded from the sitemap until reviewed.

## How the current site works

### Framework and entry points

- Framework: none; plain static HTML/CSS/JavaScript.
- Public entry point: `index.html` at `/`.
- Other public pages: `shop.html`, `standard.html`, `about.html`, and `devlog.html`.
- Legal pages: `privacy.html`, `terms.html`, and `beta-terms.html`.
- Compatibility redirect: `cmykforge-website.html` redirects to `/`.
- Error page: `404.html`.
- Shared client code: `assets/styles.css` and `assets/app.js`.
- Build entry point: `tools/build-site.mjs` creates `_site/`.
- Sites build entry point: `tools/build-sites.mjs` creates `dist/client/` and `dist/server/` from `_site/`.

### Dependencies and build

- Node.js 22 or newer is declared.
- Production pages have no npm runtime dependencies.
- Development tooling: `html-validate`, `stylelint`, `linkedom`, `lightningcss`, and `terser`.
- `npm run build` validates the source, copies production files to `_site/`, removes authoring-only assets, and minifies CSS and JavaScript.
- `npm run build:sites` first creates `_site/`, then creates the Sites Worker artifact in `dist/`.
- The dependency audit initially reported one high-severity transitive development-tool advisory in `fast-uri`. The lockfile was updated and the audit is clean.

### Hosting and domain configuration

- The live server identified itself as GitHub Pages (`server: GitHub.com`).
- The apex returned HTTP 200 over HTTPS.
- `www.cmykforge.org` returned HTTP 301 to `https://cmykforge.org/`.
- An unknown path returned the custom page with HTTP 404.
- `CNAME` contains `cmykforge.org` and remains in the repository and GitHub Pages artifact.
- `.nojekyll` is present.
- `.github/workflows/deploy-pages.yml` deploys on pushes to `main` and remains intact as the rollback deployment path.

### Current DNS observed on 2026-07-21

- Apex A: `185.199.108.153`
- Apex A: `185.199.109.153`
- Apex A: `185.199.110.153`
- Apex A: `185.199.111.153`
- Apex AAAA: none returned
- `www` CNAME: `graysonclay.github.io.`
- MX: priority `1`, `smtp.google.com.`
- SPF TXT: `v=spf1 include:_spf.google.com ~all`
- Search Console TXT: `google-site-verification=980nAsy4Kg2NtQ_K8gDlHiuepJC09QViSUW6B3BELL0`
- DMARC TXT at `_dmarc`: `v=DMARC1; p=none; rua=mailto:dmarc@cmykforge.org; pct=100`

This is a read-only snapshot, not a complete DNS zone export. DKIM and other service records may use names that cannot be discovered without the Squarespace DNS panel. Every non-hosting record must be left unchanged at cutover.

## Content, assets, and integrations

### Branding and media

- Official CMYKForge logo files are retained in `assets/images/`.
- Self-hosted Inter and Space Grotesk WOFF2 fonts avoid third-party font requests.
- Real-progress images distinguish the original, simulated preview, and physical print.
- The hero labels the physical comparison as real and includes a calibration/material disclaimer.
- The cinematic video is explicitly labelled as concept visualization.
- The production build ships the browser-compatible MP4 and retains the MOV only as an authoring source.
- AVIF is used for most browser-facing images; lossless PNG/JPEG sources stay in the repository but are excluded from production when an optimized derivative is used.

### Newsletter and forms

- Newsletter provider: Brevo/Sibforms.
- The form posts directly from the browser to `efecddb6.sibforms.com`.
- Brevo CSS and JavaScript load lazily when the newsletter section is focused, pressed, or observed near the viewport.
- The form has a required email input, explanatory privacy text, a honeypot, error/status regions, and client-side validation.
- No local API, database, secret, or environment variable is required.
- There is no general contact form; contact links use `mailto:admin@cmykforge.org`.

### Other external services

- Kickstarter campaign links.
- YouTube channel and privacy-enhanced `youtube-nocookie.com` embed.
- TikTok, Instagram, and Facebook profile links.
- No mandatory cloud product functionality is described; Standard remains local-first and non-AI.

## SEO and Search Console inventory

- Canonical origin: `https://cmykforge.org`.
- Five indexable URLs are listed in `sitemap.xml`.
- `robots.txt` allows crawlers and points to the canonical sitemap.
- Every indexable page has a unique title, description, canonical link, Open Graph data, X/Twitter card data, one H1, and JSON-LD.
- Home JSON-LD includes Organization, WebSite, WebPage, and ImageObject nodes.
- Standard includes WebPage and SoftwareApplication nodes.
- About, Shop, and Dev Log include WebPage data.
- Legal drafts are `noindex, follow` and excluded from the sitemap.
- The 404 is `noindex` and has no canonical.
- The old `cmykforge-website.html` URL is `noindex` and canonicalizes to `/`.
- Search Console verification is DNS-based and independent of the hosting provider as long as its TXT record remains.

## Accessibility and responsive behavior

Existing strengths:

- Skip links and main landmarks.
- Keyboard-operable menus, accordions, tabs, modal focus trapping, range comparison, and horizontal feature rails.
- Visible focus styles and 44-pixel mobile menu control sizing.
- `prefers-reduced-motion` and forced-colors accommodations.
- Images have alternative text and intrinsic dimensions.
- Status and error messages use appropriate live-region semantics.
- Mobile navigation becomes a scrollable overlay before links crowd the brand.

Residual risks to recheck in every preview:

- Long scrollytelling sections are visually intensive and must be checked on low-power mobile devices.
- The Brevo embed imports provider-controlled styles and behavior after page load.
- Automated checks cannot replace a manual screen-reader pass or real-device color/contrast review.

## Files that are unused or authoring-only

The repository intentionally contains higher-resolution or obsolete visual sources that are not referenced by current HTML. They remain available to designers but are removed from the production artifact where safe. Examples include the MOV source, lossless PNG progress sources, inactive product artwork, and older Standard/shop hero assets.

The `assets/images/partners/README.md` directory is intentionally empty until real partners are approved. No fabricated partners or testimonials were added.

The `assets/images/real-progress/README.md` instructions were updated to reflect that the section is live and browser pages use the approved AVIF derivatives. The media itself is genuine and clearly labelled.

## Hard-coded paths and URLs

- Canonicals, social images, JSON-LD URLs, robots, sitemap, and the compatibility redirect intentionally hard-code `https://cmykforge.org`.
- Navigation mixes `/` for home with relative `.html` page links.
- Icons and the web manifest use root-relative paths.
- This is correct for the custom domain and Sites preview, but the project-path URL `graysonclay.github.io/cmykforge-website/` is not a reliable review origin because root-relative paths resolve outside the repository subpath. Review through the custom domain, a local root server, or the Sites URL.

## ChatGPT Sites compatibility

Compatible:

- Static HTML, CSS, JavaScript, fonts, AVIF/JPEG/PNG media, MP4 video, external links, client-side UI, robots, sitemap, web manifest, and Brevo form posting.
- No server-side application state, database, file uploads, authentication, or environment variables are needed.

Adaptation required:

- Sites expects a compatible hosted artifact, not only `_site/`. The migration creates a Cloudflare Worker ESM entrypoint in `dist/server/index.js`, static assets in `dist/client/`, and a `wrangler.json` asset binding.
- Redirects and the custom 404 are application-managed by that Worker.
- Security headers are application-managed through the Worker and asset `_headers` file; there is no separate header-setting action in the current Sites connector.

## Risks and launch blockers

1. Do not change DNS until the owner has approved the exact private-review build.
2. Every Sites deployment URL is technically a production deployment. Keep access owner-only during review and do not attach the public domain until approved.
3. A controlled end-to-end Brevo signup with an inbox the owner can inspect is still required before launch; automated tests must not silently subscribe arbitrary addresses.
4. The Kickstarter “live” messaging is time-sensitive and must be rechecked immediately before launch.
5. Draft legal pages should receive legal review before commercial launch; they must remain `noindex` until approved.
6. The Sites custom-domain records must be copied from the actual domain response. Never infer or reuse placeholder DNS values.
7. If Sites custom domains are unavailable for the account/workspace, GitHub Pages must remain the production host until availability changes or another approved host is selected.

## Must remain unchanged

- Public canonical origin and current page paths.
- DNS Search Console verification TXT record.
- Google Workspace MX, SPF, DKIM, and DMARC records.
- CNAME file and GitHub Pages workflow until final cutover is complete and rollback is no longer required.
- Official logo files and established CMYKForge color identity.
- Existing privacy/offline/non-AI claims unless product behavior changes.
- Real/simulated media labels and print-result disclaimers.
- Legal-page availability and `noindex` status until reviewed.
- Newsletter action URL and privacy disclosure unless the Brevo list is intentionally replaced.

## Audit conclusion

The site is a strong migration candidate. It should be wrapped, not rewritten. The migration branch resolves the identified accuracy, deployment, and artifact-size issues while keeping GitHub Pages fully recoverable.

# CMYKForge prelaunch checklist

Status legend: `[x]` passed, `[ ]` pending, `[!]` blocked or requires owner action.

## Source protection

- [x] Work is on `chatgpt-sites-migration`.
- [x] No migration change was pushed directly to `main`.
- [x] GitHub Pages workflow remains present.
- [x] `CNAME` remains `cmykforge.org`.
- [x] Live DNS was not changed.
- [x] GitHub Pages rollback records are documented.

## Build and static validation

- [x] Clean dependency install succeeds.
- [x] `npm audit` reports zero known vulnerabilities.
- [x] HTML validation succeeds.
- [x] CSS validation succeeds.
- [x] JavaScript syntax validation succeeds.
- [x] Internal-link and asset validation succeeds.
- [x] JSON-LD parses.
- [x] Production `_site/` build succeeds.
- [x] Sites `dist/` build succeeds.
- [x] Sites package contains the required Worker and hosting metadata.
- [x] Automated Worker tests cover homepage, security headers, legacy redirect, `www` redirect, and custom 404.

## Content and product accuracy

- [x] Official logo and brand colors are preserved.
- [x] Slogan is exactly “Print What You See.”
- [x] Current development, beta, and planned features are distinguished.
- [x] 3MF is described as in active testing.
- [x] STL and OBJ are described as planned.
- [x] Optional AI is not described as required.
- [x] Standard is described as local-first and non-AI.
- [x] Real print, simulated preview, and concept visualization labels are preserved.
- [x] No testimonials, product screenshots, or print results were invented.
- [!] Reconfirm Kickstarter campaign status immediately before launch.
- [!] Legal drafts require owner/legal review before commercial launch.

## Hosted preview

- [ ] Owner-only Sites URL recorded.
- [ ] Homepage returns 200.
- [ ] All expected `.html` routes return 200.
- [ ] Legacy route returns one HTTP 308 to `/`.
- [ ] Unknown route returns custom content with HTTP 404.
- [ ] `robots.txt`, `sitemap.xml`, `site.webmanifest`, and `llms.txt` return 200.
- [ ] No unexpected console errors.
- [ ] No mixed-content requests.
- [ ] No broken fonts, images, or video.

## Desktop, tablet, and mobile

- [ ] Desktop test at approximately 1440×900.
- [ ] Tablet test at approximately 820×1180.
- [ ] Mobile test at approximately 390×844.
- [ ] No horizontal overflow at any test width.
- [ ] Navigation is readable and usable.
- [ ] Mobile menu opens, closes, and returns focus correctly.
- [ ] Calls to action remain visible without overlap.
- [ ] Comparison slider is touch- and keyboard-usable.
- [ ] Scrollytelling sections do not trap or obscure content.
- [ ] Reduced-motion mode provides complete static content.

## Navigation and interactions

- [ ] Header and footer internal links work.
- [ ] Active-page navigation is correct.
- [ ] FAQ accordions work with mouse and keyboard.
- [ ] Standard tabs support arrow keys, Home, and End.
- [ ] Planned-feature modal traps focus and closes with Escape.
- [ ] Back-to-top control works.
- [ ] External links open the intended official pages.
- [ ] `mailto:` links target `admin@cmykforge.org`.

## Newsletter

- [ ] Brevo stylesheet and script load on interaction or near-viewport observation.
- [ ] Required-email validation appears without sending invalid data.
- [ ] Error and success messages are announced accessibly.
- [!] Complete one owner-authorized subscription with a controlled inbox.
- [!] Confirm receipt and completion of the double-opt-in email.
- [!] Remove or retain the test subscriber according to the owner’s list policy.

## Accessibility

- [x] Automated markup checks pass.
- [ ] Keyboard-only pass on every page.
- [ ] Visible focus indicator on every control.
- [ ] Logical heading and landmark navigation.
- [ ] Screen-reader spot check for homepage, Standard tabs, FAQ, modal, and newsletter.
- [ ] Text/background contrast checked for normal, hover, focus, and status states.
- [ ] Zoom to 200% without lost content or horizontal scrolling.
- [ ] Forced-colors/high-contrast spot check.

## Performance

- [x] Fonts are self-hosted WOFF2 with `font-display: swap`.
- [x] Browser images use optimized AVIF where practical.
- [x] Source-only media is excluded from production.
- [x] CSS and JavaScript are minified.
- [x] Below-the-fold images are lazy-loaded where appropriate.
- [x] Video uses `preload="metadata"` rather than eager full download.
- [ ] Run a current Lighthouse/PageSpeed check on the public Sites origin after access allows an unauthenticated measurement.
- [ ] Review Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift on real mobile hardware.

## SEO

- [x] Canonical URLs remain on `https://cmykforge.org`.
- [x] Titles and descriptions are present.
- [x] Open Graph and X/Twitter metadata are present.
- [x] JSON-LD is valid JSON.
- [x] Sitemap contains only the five indexable canonical URLs.
- [x] Legal drafts and 404 remain `noindex`.
- [ ] Hosted preview source matches the reviewed metadata.
- [ ] Search Console ownership remains verified after cutover.
- [ ] Sitemap is resubmitted after cutover.
- [ ] Homepage URL inspection reports crawlable and correct canonical.

## Domain, HTTPS, and rollback

- [ ] Exact Sites apex and `www` records copied into the DNS guide.
- [ ] Owner explicitly approves launch.
- [ ] Squarespace changes performed in Google Chrome.
- [ ] Only conflicting GitHub Pages hosting records are changed.
- [ ] MX, SPF, DKIM, DMARC, Search Console, and unrelated verification records are unchanged.
- [ ] Apex resolves to Sites.
- [ ] `www` resolves and redirects to apex.
- [ ] SSL is active for both hostnames.
- [ ] Rollback values are immediately available.

## Launch gate

Do not launch while any `[!]` item is unresolved or any core hosted-preview, form, domain, HTTPS, or SEO item remains unchecked. Final launch requires explicit owner approval.

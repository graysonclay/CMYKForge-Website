# CMYKForge final migration review package

Prepared: 2026-07-21  
Branch: `chatgpt-sites-migration`  
Launch status: **Not launched; public DNS remains on GitHub Pages**

## 1. Owner-only review URL

Pending first Sites deployment. Every Sites deployment URL is a production URL, so access will remain owner-only during review.

## 2. Summary of changes

- Preserved the existing static site, branding, official logos, content, page structure, canonical URLs, newsletter, SEO metadata, structured data, accessibility work, and responsive behavior.
- Added clear current-development, limited-beta, and planned capability sections.
- Corrected inconsistent STL/OBJ export claims; 3MF is in active testing and STL/OBJ are planned.
- Fixed the GitHub Pages workflow to upload the validated/minified `_site/` artifact rather than the repository root.
- Removed unused authoring assets from production while retaining them in source.
- Cleared the npm dependency audit finding.
- Added a thin ChatGPT Sites Worker artifact that preserves `.html` URLs, serves the existing site, returns the custom 404 with HTTP 404, redirects the legacy URL and `www`, and adds conservative security headers.
- Added the complete audit, SEO plan, Sites deployment guide, prelaunch checklist, Squarespace DNS plan, Search Console instructions, and rollback procedure.

## 3. Files changed

The final list will be generated from the committed branch after hosted-preview validation.

## 4. Build and test results

Local results:

- HTML/CSS/JavaScript validation: pass.
- Internal links, assets, metadata, JSON-LD, robots, and sitemap: pass.
- GitHub Pages production build: pass.
- Sites Worker build and package: pass.
- Dependency audit: zero known vulnerabilities.
- Local Worker routes: all expected pages 200; legacy redirect 308; unknown route 404.
- Desktop/tablet/mobile browser review: pass with no horizontal overflow or console warnings observed.
- Mobile menu open/close/Escape/focus behavior: pass.
- Brevo assets and invalid-email validation: pass without creating a subscription.
- External destinations: official Kickstarter page, social profiles, YouTube, and Brevo assets resolved during the audit. Kickstarter showed an active campaign at review time.

Pending hosted results are tracked in `docs/prelaunch-checklist.md`.

## 5. Known limitations

- An owner-authorized end-to-end Brevo double-opt-in test is still required.
- Legal pages are drafts and remain `noindex` pending legal review.
- Kickstarter status must be rechecked at launch because it is time-sensitive.
- Public PageSpeed field testing cannot be completed against an owner-only Site; run it after an approved public deployment but before or immediately after DNS cutover.
- Custom-domain availability depends on the Sites account/workspace.

## 6. SEO migration summary

- Canonical origin remains `https://cmykforge.org`.
- Five indexable paths remain unchanged.
- Legal drafts remain accessible but `noindex` and outside the sitemap.
- `cmykforge-website.html` becomes a server-side 308 to `/` on Sites.
- `www` remains secondary and redirects to the apex.
- Search Console DNS verification must remain untouched.

See `docs/seo-migration-plan.md` and `docs/search-console-after-migration.md`.

## 7. Exact Squarespace DNS changes

Pending the exact records returned by the CMYKForge Site. No Squarespace access or DNS change has occurred.

See `docs/squarespace-dns-cutover.md`.

## 8. Search Console checklist

Use the existing property, confirm DNS ownership, live-test the homepage, resubmit the same sitemap, confirm canonicals/HTTPS, and monitor indexing, Core Web Vitals, 404s, redirects, and search performance.

## 9. Rollback

Restore the four GitHub Pages A records and `www` CNAME, keep every email/verification record, confirm the repository `CNAME` and GitHub Pages HTTPS, and restrict the Sites deployment after GitHub is serving again.

## 10. Readiness recommendation

**Not ready for public launch yet.** The code and local artifact are ready for owner-only hosted review. Public launch remains blocked on hosted-preview approval, the controlled newsletter test, exact Sites DNS values, custom-domain/SSL validation, final legal/Kickstarter review, and explicit owner authorization.

# CMYKForge final migration review package

Prepared: 2026-07-21  
Branch: `chatgpt-sites-migration`  
Launch status: **Not launched; public DNS remains on GitHub Pages**

## 1. Owner-only review URL

[https://cmykforge-migration.big-carp.chatgpt.site](https://cmykforge-migration.big-carp.chatgpt.site)

The Site is deployed with owner-only access for review. It is not attached to the public CMYKForge DNS.

## 2. Summary of changes

- Preserved the existing static site, branding, official logos, content, page structure, canonical URLs, newsletter, SEO metadata, structured data, accessibility work, and responsive behavior.
- Added clear current-development, limited-beta, and planned capability sections.
- Corrected inconsistent STL/OBJ export claims; 3MF is in active testing and STL/OBJ are planned.
- Preserved the live GitHub Pages workflow and `CNAME` unchanged as the known-good rollback path.
- Removed unused authoring assets from production while retaining them in source.
- Cleared the npm dependency audit finding.
- Added a thin ChatGPT Sites Worker artifact that preserves `.html` URLs, serves the existing site, returns the custom 404 with HTTP 404, redirects the legacy URL and `www`, and adds conservative security headers.
- Added the complete audit, SEO plan, Sites deployment guide, prelaunch checklist, Squarespace DNS plan, Search Console instructions, and rollback procedure.

## 3. Files changed

- Hosting/build: `.openai/hosting.json`, `.gitignore`, `package.json`, `package-lock.json`, `tools/build-site.mjs`, `tools/build-sites.mjs`, `tools/test-sites-build.mjs`.
- Site/content: `index.html`, `standard.html`, `shop.html`, `sitemap.xml`, `assets/styles.css`, `assets/images/real-progress/README.md`.
- Documentation: `README.md` and all seven migration documents in `docs/`, including this review package.

## 4. Build and test results

Local results:

- HTML/CSS/JavaScript validation: pass.
- Internal links, assets, metadata, JSON-LD, robots, and sitemap: pass.
- GitHub Pages production build: pass.
- Sites Worker build and package: pass.
- Dependency audit: zero known vulnerabilities.
- Local Worker routes: all expected pages 200; legacy redirect 308; unknown route 404. A Sites-specific asset canonicalization issue discovered on the first hosted version was corrected with byte-identical page aliases so established `.html` URLs remain 200.
- Desktop/tablet/mobile browser review: pass with no horizontal overflow or console warnings observed.
- Mobile menu open/close/Escape/focus behavior: pass.
- Brevo assets and invalid-email validation: pass without creating a subscription.
- External destinations: official Kickstarter page, social profiles, YouTube, and Brevo assets resolved during the audit. Kickstarter showed an active campaign at review time.

Hosted results are tracked in `docs/prelaunch-checklist.md`.

## 5. Known limitations

- An owner-authorized end-to-end Brevo double-opt-in test is still required.
- Legal pages are drafts and remain `noindex` pending legal review.
- Kickstarter status must be rechecked at launch because it is time-sensitive.
- Public PageSpeed field testing cannot be completed against an owner-only Site; run it after an approved public deployment but before or immediately after DNS cutover.
- The exact custom-domain records are attached in Sites but intentionally remain pending; SSL initialization cannot finish before approved DNS validation.

## 6. SEO migration summary

- Canonical origin remains `https://cmykforge.org`.
- Five indexable paths remain unchanged.
- Legal drafts remain accessible but `noindex` and outside the sitemap.
- `cmykforge-website.html` becomes a server-side 308 to `/` on Sites.
- `www` remains secondary and redirects to the apex.
- Search Console DNS verification must remain untouched.

See `docs/seo-migration-plan.md` and `docs/search-console-after-migration.md`.

## 7. Exact Squarespace DNS changes

Sites supplied two apex A targets, one `www` CNAME target, and four validation TXT records. They are recorded verbatim in the DNS guide. No Squarespace access or DNS change has occurred.

See `docs/squarespace-dns-cutover.md`.

## 8. Search Console checklist

Use the existing property, confirm DNS ownership, live-test the homepage, resubmit the same sitemap, confirm canonicals/HTTPS, and monitor indexing, Core Web Vitals, 404s, redirects, and search performance.

## 9. Rollback

Restore the four GitHub Pages A records and `www` CNAME, keep every email/verification record, confirm the repository `CNAME` and GitHub Pages HTTPS, and restrict the Sites deployment after GitHub is serving again.

## 10. Readiness recommendation

**Ready for owner review; not ready for public launch.** Public launch remains gated by owner preview approval, the controlled newsletter test, final legal/Kickstarter review, explicit launch authorization, the documented Squarespace cutover, and successful custom-domain/SSL validation.

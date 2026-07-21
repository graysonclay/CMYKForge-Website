# ChatGPT Sites deployment guide

This guide reflects the Sites capabilities available on 2026-07-21 and the official [ChatGPT Sites developer guide](https://learn.chatgpt.com/docs/sites) and [Sites help article](https://help.openai.com/en/articles/20001339-creating-and-managing-chatgpt-sites).

Important: every Sites deployment URL is a production deployment. CMYKForge uses owner-only access as its review environment. Saving a version without deploying it is the safest pre-deployment review stage.

## Compatibility decision

The existing plain static framework is supported after a thin artifact adaptation:

- Existing source stays plain HTML/CSS/JavaScript.
- `npm run build` creates the static `_site/` artifact used by GitHub Pages.
- `npm run build:sites` creates `dist/client/` plus a Cloudflare Worker-compatible `dist/server/index.js` for Sites.
- No server-side application functionality is required.
- No D1 database, R2 bucket, authentication, or environment variable is required.
- The Brevo newsletter form continues to post directly to Brevo from the browser.

## Feature support summary

| Feature | Result |
|---|---|
| Existing framework | Preserved; wrapped as a static Sites Worker artifact |
| Build command | Required: `npm run build:sites` |
| Static output | `_site/` for GitHub Pages; `dist/client/` for Sites |
| Server output | `dist/server/index.js` |
| Environment variables | None |
| Newsletter | External Brevo form; no hosted secret required |
| Contact form | None; contact is `mailto:` |
| Redirects | Implemented in the Worker; no separate redirect service required |
| Custom headers | Implemented by the Worker and asset `_headers`; no separate Sites UI setting is assumed |
| Custom 404 | Implemented by the Worker using the existing `404.html` with HTTP 404 |
| Analytics | No existing GA found; Sites platform analytics is separate and automatic where available |

## 1. Connect the repository

1. Clone `https://github.com/graysonclay/CMYKForge-Website`.
2. Check out `chatgpt-sites-migration`.
3. Confirm `git status --short --branch` shows the migration branch.
4. Do not merge or deploy `main` during review.
5. In Codex or ChatGPT Sites, start from this compatible local project. Sites links the local source project to its hosted project through `.openai/hosting.json`.
6. After Sites creates the hosted project, preserve the exact opaque `project_id` it writes to `.openai/hosting.json`.

The current Sites integration does not require replacing the GitHub origin. Publishing uses the exact Git commit for the saved version and a Sites-managed source repository connection. GitHub remains the canonical development repository and rollback source.

## 2. Build the website

```sh
npm ci
npm test
npm run build:sites
```

Required artifact checks:

```sh
test -f dist/server/index.js
test -f dist/server/wrangler.json
test -f dist/client/index.html
test -f .openai/hosting.json
```

Package with the Sites helper only after the build passes. The package must contain `dist/server/index.js` and `dist/.openai/hosting.json`.

## 3. Create the Site

1. In Codex, ask Sites to create one site named “CMYKForge Website” with an owner-only audience.
2. Use a stable slug such as `cmykforge-migration` if available.
3. Persist the returned project ID in `.openai/hosting.json` immediately.
4. Keep access limited to the owner and workspace admins.
5. Do not add `cmykforge.org` yet if the build has not been validated.

## 4. Create and deploy the private review version

1. Commit the exact validated source on `chatgpt-sites-migration`.
2. Push that commit to the Sites-managed source connection.
3. Build and package from that same commit.
4. Save one Sites version using that exact commit SHA.
5. Deploy with the owner-only private deployment action.
6. Poll until the deployment succeeds or fails.
7. Record the URL in `docs/final-review-package.md`.

Do not call this a staging URL in risk decisions: it is a production deployment with restricted access.

## 5. Test the private review URL

Test all public routes, the custom 404, the legacy redirect, assets, metadata, responsive breakpoints, keyboard operation, the newsletter embed, and external links. Use `docs/prelaunch-checklist.md` as the signed checklist.

The final Brevo subscription test must use an inbox controlled by CMYKForge and must verify the double-opt-in message and confirmation flow. Do not add arbitrary test addresses to the marketing list.

## 6. Prepare the custom domain

Only after the private review is approved:

1. In Site settings, choose **Add domain**.
2. Add `cmykforge.org` and separately add `www.cmykforge.org` if Sites supports both attachments.
3. Copy the exact apex A targets, `www` CNAME target, and validation records returned by Sites.
4. Record them in `docs/squarespace-dns-cutover.md`.
5. Do not edit Squarespace DNS until the owner gives explicit launch approval.

## 7. Connect `cmykforge.org`

After explicit approval, use Google Chrome for Squarespace:

1. Open Squarespace Domains in Chrome.
2. Add the Sites validation and hosting records exactly as documented.
3. Remove only the conflicting GitHub Pages A records and `www` CNAME.
4. Keep all email and verification records.
5. Refresh the custom-domain status in Sites.

## 8. Confirm SSL

1. Wait for Sites to report the domain active and SSL active.
2. Open `https://cmykforge.org` and `https://www.cmykforge.org` in a signed-out visitor context.
3. Confirm there is no certificate warning or redirect loop.
4. Confirm `www` resolves to the apex and preserves path/query.

## 9. Confirm redirects and Search Console

1. Verify the legacy URL returns HTTP 308 to `/`.
2. Verify unknown pages return HTTP 404.
3. Verify the sitemap and robots files return HTTP 200.
4. Confirm the existing Search Console property still shows verified ownership.
5. Resubmit the unchanged sitemap URL.

## 10. Roll back if necessary

1. Stop changing the application.
2. In Squarespace DNS, restore the four GitHub Pages apex A records and `www` CNAME listed in the DNS cutover guide.
3. Remove only conflicting Sites hosting records; retain email and verification records.
4. Confirm the GitHub Pages custom domain still contains `cmykforge.org` and HTTPS is enabled.
5. Wait for DNS caches to expire and verify GitHub headers at the apex.
6. Restrict or remove access to the Sites deployment after the domain is safely back on GitHub Pages.

## Unsupported or unconfirmed items

- Some Sites account/workspace types may not offer public custom domains. If **Add domain** is unavailable, do not cut over.
- Sites does not expose a separate redirect or custom-header configuration action in the current integration; CMYKForge handles both in its Worker.
- The exact custom-domain DNS values are intentionally absent until returned by the specific CMYKForge Site.
- Sites is in public beta. Recheck official documentation and the Site settings immediately before launch.

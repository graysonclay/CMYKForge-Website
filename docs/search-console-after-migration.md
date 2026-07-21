# Google Search Console after the CMYKForge migration

The public domain remains `cmykforge.org`, so the existing Search Console property should remain in use. A new property is not needed unless the existing account no longer contains either a Domain property for `cmykforge.org` or an HTTPS URL-prefix property for `https://cmykforge.org/`.

## Before DNS cutover

1. Open Search Console and select the existing CMYKForge property.
2. Record the current property type, ownership users, submitted sitemap status, indexed-page count, and recent Performance totals.
3. Confirm the DNS verification record is present:
   `google-site-verification=980nAsy4Kg2NtQ_K8gDlHiuepJC09QViSUW6B3BELL0`.
4. Export or screenshot current Page indexing and Core Web Vitals summaries for comparison.
5. Do not use **Change of Address** because the domain is not changing.

## Confirm ownership after cutover

1. Open **Settings** in the existing property.
2. Open **Ownership verification**.
3. Confirm ownership remains verified.
4. If verification is pending, check that the existing TXT record still resolves. Do not create a new property as the first response.

## Confirm the homepage is crawlable

1. Open `https://cmykforge.org/` in a signed-out browser.
2. Confirm HTTP 200, visible content, no login requirement, and no `noindex` directive.
3. Open `https://cmykforge.org/robots.txt` and confirm `Allow: /` plus the canonical sitemap.
4. Open `https://cmykforge.org/sitemap.xml` and confirm all five indexable URLs are present.

## Submit or resubmit the sitemap

1. In Search Console, open **Sitemaps**.
2. Enter `sitemap.xml` under **Add a new sitemap** if it is not already listed.
3. If it is listed, submit/resubmit the same URL after launch.
4. Confirm the status becomes **Success**. Do not submit the legal pages or 404 separately.

## Inspect the homepage

1. Paste `https://cmykforge.org/` into **URL inspection**.
2. Choose **Test live URL**.
3. Confirm the page is available to Google, indexing is allowed, resources load, and the user-declared canonical is `https://cmykforge.org/`.
4. Confirm Google-selected canonical is the same once recrawled.
5. Choose **Request indexing** only if the live test succeeds and the page has materially changed or is not indexed. Do not repeatedly request indexing.

Repeat for:

- `https://cmykforge.org/standard.html`
- `https://cmykforge.org/shop.html`
- `https://cmykforge.org/about.html`
- `https://cmykforge.org/devlog.html`
- `https://cmykforge.org/cmykforge-website.html` to confirm Google observes the redirect

## Monitor indexing and errors

1. Open **Indexing → Pages** (or the current **Page indexing** report label).
2. Watch for new Not found (404), Soft 404, Page with redirect, Redirect error, Duplicate without user-selected canonical, Crawled—currently not indexed, and Blocked by robots.txt categories.
3. A “Page with redirect” result for `cmykforge-website.html` and `www` variants is expected.
4. Legal drafts excluded by `noindex` are expected and should not be forced into the index.
5. Investigate any new 404 for a formerly valid page.

## HTTPS and Core Web Vitals

1. Open the **HTTPS** report and confirm all indexed URLs are served over HTTPS without certificate or canonical mismatch.
2. Open **Core Web Vitals** and compare mobile and desktop trends with the pre-launch baseline.
3. Allow field data time to accumulate; the report is not instant.
4. If regressions appear, inspect Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift on the affected template.

## Confirm canonical URLs

For each indexable page, inspect page source and Search Console:

- Exactly one absolute canonical points to the same public URL.
- `og:url` matches the canonical.
- Structured-data `url` and `@id` values remain on `https://cmykforge.org`.
- `www` is not selected as canonical.

## Performance monitoring after launch

For at least four weeks:

1. Open **Performance → Search results**.
2. Compare clicks, impressions, CTR, and average position with the same previous period.
3. Review by page and query, especially the homepage and Standard page.
4. Annotate the launch date in the team’s migration record.
5. Investigate sudden drops alongside indexing, HTTPS, crawl, and DNS evidence before changing content.

## When a new property would be appropriate

Create a new property only if no compatible property exists in the account. Prefer one Domain property for `cmykforge.org`, verified by DNS. Keep the existing property and historical data; do not delete it.

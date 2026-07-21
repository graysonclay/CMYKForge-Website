# CMYKForge SEO migration plan

Canonical origin before and after migration: `https://cmykforge.org`  
Sitemap before and after migration: `https://cmykforge.org/sitemap.xml`

## URL mapping

| Current URL | New URL | Unchanged | Redirect needed | Canonical | Search Console impact | Sitemap impact |
|---|---|---:|---:|---|---|---|
| `https://cmykforge.org/` | Same | Yes | No | `/` | Existing URL remains valid | Remains listed |
| `https://cmykforge.org/shop.html` | Same | Yes | No | `/shop.html` | Existing URL remains valid | Remains listed |
| `https://cmykforge.org/standard.html` | Same | Yes | No | `/standard.html` | Existing URL remains valid | Remains listed |
| `https://cmykforge.org/about.html` | Same | Yes | No | `/about.html` | Existing URL remains valid | Remains listed |
| `https://cmykforge.org/devlog.html` | Same | Yes | No | `/devlog.html` | Existing URL remains valid | Remains listed |
| `https://cmykforge.org/privacy.html` | Same | Yes | No | `/privacy.html` | Remains `noindex, follow` | Must remain excluded |
| `https://cmykforge.org/terms.html` | Same | Yes | No | `/terms.html` | Remains `noindex, follow` | Must remain excluded |
| `https://cmykforge.org/beta-terms.html` | Same | Yes | No | `/beta-terms.html` | Remains `noindex, follow` | Must remain excluded |
| `https://cmykforge.org/cmykforge-website.html` | `/` | No | Yes, HTTP 308 | `/` | Cleaner server redirect replaces client-only redirect | Must remain excluded |
| `https://www.cmykforge.org/*` | `https://cmykforge.org/*` | Host changes only | Yes, HTTP 308 preserving path/query | Apex equivalent | Same canonical origin as today | No sitemap change |
| Unknown paths | Custom `404.html` | N/A | No | None | Must return real 404 and remain `noindex` | Must not be listed |

## Metadata preservation

- Preserve page titles, descriptions, canonical URLs, Open Graph data, X/Twitter card data, and JSON-LD unless a content change genuinely requires an update.
- Preserve absolute social-image URLs under `https://cmykforge.org/assets/images/`.
- Preserve the Organization and WebSite IDs rooted at `https://cmykforge.org/#...`.
- Keep exactly one H1 on each indexable page.
- Keep legal pages and the 404 out of the sitemap.

## Search Console ownership

The live DNS TXT record verifies the domain and must not be removed:

`google-site-verification=980nAsy4Kg2NtQ_K8gDlHiuepJC09QViSUW6B3BELL0`

Because the public domain does not change, the existing Search Console property should remain in use. A new property is not required. If the existing property is only a URL-prefix property, it still remains compatible because HTTPS and the apex origin remain the same.

## Sitemap and robots

- Keep `robots.txt` at `/robots.txt` with `Allow: /` and the canonical sitemap line.
- Keep the sitemap at `/sitemap.xml`.
- Update `<lastmod>` only for pages materially changed in the migration.
- After launch, resubmit the existing sitemap in Search Console; do not create a new sitemap URL.

## Redirect validation

At preview and again after cutover, confirm with headers rather than visual navigation alone:

```sh
curl -I https://cmykforge.org/cmykforge-website.html
curl -I https://www.cmykforge.org/standard.html?seo-check=1
curl -I https://cmykforge.org/not-a-real-page
```

Expected after cutover:

- Legacy URL: one HTTP 308 to `https://cmykforge.org/`.
- `www`: one HTTP 308 to the same apex path and query.
- Unknown path: HTTP 404 with the CMYKForge custom error page.

## Launch monitoring

- Compare indexed URL counts before and after migration.
- Inspect `/`, `/standard.html`, and `/cmykforge-website.html` in Search Console.
- Monitor Page indexing, HTTPS, Core Web Vitals, and Performance for at least four weeks.
- Investigate new 404, soft-404, redirect-error, duplicate-canonical, or blocked-resource reports.
- Do not request indexing for legal drafts or the 404.

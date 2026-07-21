# CMYKForge Website

Production source for [cmykforge.org](https://cmykforge.org), a static HTML/CSS/JavaScript site deployed to GitHub Pages.

## Local validation

Node.js 22 or newer is required for the repository's quality checks and deterministic production build.

```sh
npm ci
npm test
npm run build
npm run build:sites
```

`npm test` validates HTML, CSS, JavaScript syntax, internal links, local assets, metadata, JSON-LD, `robots.txt`, and `sitemap.xml`. `npm run build` repeats those checks and writes only production files to `_site/`.

`npm run build:sites` preserves that static output and adds the Cloudflare Worker-compatible `dist/` artifact required by ChatGPT Sites. The Sites project linkage is stored in `.openai/hosting.json`; it contains no secrets.

## Deployment

Pushes to `main` run the existing quality and GitHub Pages deployment workflows. Pages continues to publish the repository root so the current live-host rollback path remains unchanged; `npm run build` creates the smaller local `_site/` artifact used for validation. See [DEPLOY.md](DEPLOY.md) for domain and DNS setup.

The `chatgpt-sites-migration` branch prepares an owner-only ChatGPT Sites review deployment. Do not connect the public domain or merge that branch until the migration checklist is approved.

# CMYKForge Website

Production source for [cmykforge.org](https://cmykforge.org), a static HTML/CSS/JavaScript site deployed to GitHub Pages.

## Local validation

Node.js 22 or newer is required for the repository's quality checks and deterministic production build.

```sh
npm ci
npm test
npm run build
```

`npm test` validates HTML, CSS, JavaScript syntax, internal links, local assets, metadata, JSON-LD, `robots.txt`, and `sitemap.xml`. `npm run build` repeats those checks and writes only production files to `_site/`.

## Deployment

Pushes to `main` run the quality workflow and the GitHub Pages deployment workflow. The deployment job validates the repository, builds `_site/`, and publishes that production artifact. See [DEPLOY.md](DEPLOY.md) for domain and DNS setup.

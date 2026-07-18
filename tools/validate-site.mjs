import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';

const root = fileURLToPath(new URL('../', import.meta.url));
const htmlFiles = (await readdir(root)).filter((file) => extname(file) === '.html').sort();
const failures = [];
const documents = new Map();
const indexableCanonicals = new Map();

function fail(file, message) {
  failures.push(`${file}: ${message}`);
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function isNoindex(document) {
  return [...document.querySelectorAll('meta[name="robots"]')]
    .some((meta) => /(?:^|,)\s*noindex\b/i.test(meta.getAttribute('content') || ''));
}

for (const file of htmlFiles) {
  const source = await readFile(join(root, file), 'utf8');
  const { document } = parseHTML(source);
  documents.set(file, document);

  if (document.documentElement?.getAttribute('lang') !== 'en') fail(file, 'root html element must declare lang="en"');
  if (!document.querySelector('title')?.textContent.trim()) fail(file, 'missing non-empty title');

  const ids = [...document.querySelectorAll('[id]')].map((node) => node.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) fail(file, `duplicate id(s): ${[...new Set(duplicateIds)].join(', ')}`);

  if (!['404.html', 'cmykforge-website.html'].includes(file) && !isNoindex(document)) {
    if (!document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim()) fail(file, 'indexable page lacks a meta description');
    const canonicalLinks = document.querySelectorAll('link[rel="canonical"]');
    if (canonicalLinks.length !== 1) fail(file, `indexable page must have exactly one canonical URL (found ${canonicalLinks.length})`);
    const canonical = canonicalLinks[0]?.getAttribute('href') || '';
    if (!canonical.startsWith('https://cmykforge.org/')) fail(file, 'indexable page lacks an absolute cmykforge.org canonical URL');
    else indexableCanonicals.set(file, canonical);
    if (document.querySelectorAll('h1').length !== 1) fail(file, `indexable page must contain exactly one h1 (found ${document.querySelectorAll('h1').length})`);

    const requiredSocialMetadata = [
      ['property', 'og:type'],
      ['property', 'og:site_name'],
      ['property', 'og:title'],
      ['property', 'og:description'],
      ['property', 'og:url'],
      ['property', 'og:image'],
      ['property', 'og:image:alt'],
      ['name', 'twitter:card'],
      ['name', 'twitter:title'],
      ['name', 'twitter:description'],
      ['name', 'twitter:image'],
      ['name', 'twitter:image:alt']
    ];
    for (const [attribute, value] of requiredSocialMetadata) {
      if (!document.querySelector(`meta[${attribute}="${value}"]`)?.getAttribute('content')?.trim()) {
        fail(file, `missing ${value} metadata`);
      }
    }
    if (document.querySelector('meta[property="og:url"]')?.getAttribute('content') !== canonical) {
      fail(file, 'og:url must match the canonical URL');
    }
    if (!document.querySelector('script[type="application/ld+json"]')) fail(file, 'indexable page lacks JSON-LD structured data');
  }

  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      JSON.parse(script.textContent);
    } catch (error) {
      fail(file, `invalid JSON-LD: ${error.message}`);
    }
  }

  for (const image of document.querySelectorAll('img')) {
    if (!image.hasAttribute('alt')) fail(file, `image ${image.getAttribute('src') || '(missing src)'} lacks alt`);
    if (!image.hasAttribute('width') || !image.hasAttribute('height')) fail(file, `image ${image.getAttribute('src') || '(missing src)'} lacks intrinsic dimensions`);
  }

  const assetAttributes = [
    ...[...document.querySelectorAll('[src]')].map((node) => ['src', node.getAttribute('src')]),
    ...[...document.querySelectorAll('link[href]')].map((node) => ['href', node.getAttribute('href')])
  ];
  for (const [, value] of assetAttributes) {
    if (!value || /^(?:[a-z]+:|\/\/|#|data:)/i.test(value)) continue;
    const localValue = value.split(/[?#]/, 1)[0].replace(/^\//, '');
    const path = normalize(join(root, dirname(file), localValue));
    if (!path.startsWith(root) || !(await exists(path))) fail(file, `missing local asset: ${value}`);
  }
}

const canonicalValues = [...indexableCanonicals.values()];
if (canonicalValues.length !== new Set(canonicalValues).size) fail('HTML', 'indexable pages contain duplicate canonical URLs');

for (const [file, document] of documents) {
  for (const anchor of document.querySelectorAll('a[href]')) {
    const href = anchor.getAttribute('href');
    if (!href || /^(?:[a-z]+:|\/\/)/i.test(href)) continue;
    if (href === '#') {
      if (!anchor.hasAttribute('data-social')) fail(file, 'contains an unexplained href="#" link');
      continue;
    }

    const [pathname, fragment] = href.split('#', 2);
    let targetFile = pathname || file;
    if (targetFile === '/' || targetFile === './') targetFile = 'index.html';
    targetFile = targetFile.replace(/^\//, '');
    targetFile = normalize(join(dirname(file), targetFile));
    if (targetFile.startsWith('..') || !(await exists(join(root, targetFile)))) {
      fail(file, `broken internal link: ${href}`);
      continue;
    }
    if (fragment && documents.has(targetFile) && !documents.get(targetFile).getElementById(fragment)) {
      fail(file, `missing fragment target: ${href}`);
    }
  }
}

const robots = await readFile(join(root, 'robots.txt'), 'utf8');
if (!/^User-agent:\s*\*/mi.test(robots) || !/^Sitemap:\s*https:\/\/cmykforge\.org\/sitemap\.xml\s*$/mi.test(robots)) {
  fail('robots.txt', 'must allow generic crawlers and declare the canonical HTTPS sitemap');
}

const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!sitemapUrls.length) fail('sitemap.xml', 'contains no URLs');
if (sitemapUrls.length !== new Set(sitemapUrls).size) fail('sitemap.xml', 'contains duplicate URLs');
for (const url of sitemapUrls) {
  if (!url.startsWith('https://cmykforge.org/')) fail('sitemap.xml', `non-canonical URL: ${url}`);
  const pathname = new URL(url).pathname;
  const file = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  if (!documents.has(file)) fail('sitemap.xml', `URL has no matching HTML file: ${url}`);
  else if (isNoindex(documents.get(file))) fail('sitemap.xml', `noindex URL is listed: ${url}`);
}
for (const [file, canonical] of indexableCanonicals) {
  if (!sitemapUrls.includes(canonical)) fail('sitemap.xml', `missing indexable canonical from ${file}: ${canonical}`);
}

if (!isNoindex(documents.get('404.html'))) fail('404.html', 'custom error page must be noindex');
if (documents.get('404.html')?.querySelector('link[rel="canonical"]')) fail('404.html', 'custom error page must not declare a canonical URL');
if (!isNoindex(documents.get('cmykforge-website.html'))) fail('cmykforge-website.html', 'legacy redirect page must be noindex');
if (documents.get('cmykforge-website.html')?.querySelector('link[rel="canonical"]')?.getAttribute('href') !== 'https://cmykforge.org/') {
  fail('cmykforge-website.html', 'legacy redirect canonical must point to the absolute home URL');
}
if (documents.get('cmykforge-website.html')?.querySelector('meta[http-equiv="refresh"]')?.getAttribute('content') !== '0; url=https://cmykforge.org/') {
  fail('cmykforge-website.html', 'legacy redirect must use an immediate absolute meta-refresh target');
}

if (failures.length) {
  console.error(`Site validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Validated ${htmlFiles.length} HTML files, ${sitemapUrls.length} sitemap URLs, internal links, assets, metadata, and structured data.`);
}

import { access, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const workerUrl = new URL('../dist/server/index.js', import.meta.url);
const client = new URL('../dist/client/', import.meta.url);

try {
  await access(workerUrl);
} catch {
  console.log('Sites artifact not present; run npm run build:sites for deployment tests.');
  process.exit(0);
}

const { default: worker } = await import(`${workerUrl.href}?test=${Date.now()}`);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const env = {
  ASSETS: {
    async fetch(request) {
      const url = new URL(request.url);
      const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
      const file = new URL(`.${pathname}`, client);
      try {
        const body = await readFile(file);
        const extension = pathname.slice(pathname.lastIndexOf('.'));
        return new Response(request.method === 'HEAD' ? null : body, {
          status: 200,
          headers: { 'Content-Type': contentTypes[extension] || 'application/octet-stream' }
        });
      } catch {
        return new Response('Not Found', { status: 404 });
      }
    }
  }
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const homepage = await worker.fetch(new Request('https://preview.example/'), env);
assert(homepage.status === 200, 'homepage must return 200');
const homepageHtml = await homepage.text();
assert(homepageHtml.includes('Print What') && homepageHtml.includes('You See.'), 'homepage content is missing');
assert(homepage.headers.get('x-content-type-options') === 'nosniff', 'security headers are missing');

const legacy = await worker.fetch(new Request('https://preview.example/cmykforge-website.html'), env);
assert(legacy.status === 308, 'legacy URL must return 308');
assert(legacy.headers.get('location') === 'https://preview.example/', 'legacy redirect target is wrong');

const www = await worker.fetch(new Request('https://www.cmykforge.org/standard.html?source=test'), env);
assert(www.status === 308, 'www hostname must return 308');
assert(www.headers.get('location') === 'https://cmykforge.org/standard.html?source=test', 'www redirect must preserve path and query');

const missing = await worker.fetch(new Request('https://preview.example/missing-page'), env);
assert(missing.status === 404, 'unknown route must return 404');
assert((await missing.text()).includes('Page not found'), 'custom 404 content is missing');
assert(missing.headers.get('cache-control') === 'no-store', '404 response must not be cached');

console.log('Validated Sites homepage, security headers, redirects, and custom 404 handling.');

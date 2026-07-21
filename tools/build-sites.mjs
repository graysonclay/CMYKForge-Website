import { copyFile, cp, mkdir, readFile, readdir, rm, unlink, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const staticOutput = new URL('../_site/', import.meta.url);
const sitesOutput = new URL('../dist/', import.meta.url);
const clientOutput = new URL('../dist/client/', import.meta.url);
const serverOutput = new URL('../dist/server/', import.meta.url);

await rm(sitesOutput, { recursive: true, force: true });
await mkdir(clientOutput, { recursive: true });
await mkdir(serverOutput, { recursive: true });
await cp(staticOutput, clientOutput, { recursive: true });

// Sites' managed asset layer may canonicalize .html paths before the Worker can
// return them. Keep byte-identical, non-HTML aliases so the Worker can preserve
// the site's established public URLs with direct 200 responses.
const htmlAliasOutput = new URL('__html/', clientOutput);
await mkdir(htmlAliasOutput, { recursive: true });
for (const file of (await readdir(clientOutput)).filter((name) => name.endsWith('.html'))) {
  await copyFile(new URL(file, clientOutput), new URL(`${file.slice(0, -5)}.page`, htmlAliasOutput));
}

// Sites serves the legacy URL with a real HTTP redirect from the Worker.
// GitHub Pages keeps the source meta-refresh page as its compatible fallback.
await unlink(new URL('cmykforge-website.html', clientOutput));

const worker = `const SECURITY_HEADERS = {
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'www.cmykforge.org') {
      url.hostname = 'cmykforge.org';
      return Response.redirect(url.toString(), 308);
    }

    if (url.pathname === '/cmykforge-website.html') {
      url.pathname = '/';
      url.search = '';
      url.hash = '';
      return Response.redirect(url.toString(), 308);
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return withSecurityHeaders(new Response('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' }
      }));
    }

    let assetRequest = request;
    let servesHtmlAlias = false;
    if (url.pathname === '/' || url.pathname.endsWith('.html')) {
      const pageName = url.pathname === '/' ? 'index' : url.pathname.slice(1, -5);
      const pageUrl = new URL('/__html/' + pageName + '.page', request.url);
      assetRequest = new Request(pageUrl, request);
      servesHtmlAlias = true;
    }

    const response = await env.ASSETS.fetch(assetRequest);
    if (response.status !== 404) {
      if (!servesHtmlAlias) return withSecurityHeaders(response);
      const headers = new Headers(response.headers);
      headers.set('Content-Type', 'text/html; charset=utf-8');
      return withSecurityHeaders(new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      }));
    }

    const notFoundUrl = new URL('/__html/404.page', request.url);
    const notFound = await env.ASSETS.fetch(new Request(notFoundUrl, { method: request.method }));
    const headers = new Headers(notFound.headers);
    headers.set('Cache-Control', 'no-store');
    return withSecurityHeaders(new Response(request.method === 'HEAD' ? null : notFound.body, {
      status: 404,
      headers
    }));
  }
};
`;

const wrangler = {
  name: 'cmykforge-website',
  compatibility_date: '2026-05-15',
  main: 'index.js',
  no_bundle: true,
  rules: [{ type: 'ESModule', globs: ['**/*.js', '**/*.mjs'] }],
  assets: {
    directory: '../client',
    binding: 'ASSETS',
    run_worker_first: true,
    html_handling: 'none',
    not_found_handling: 'none'
  },
  observability: { enabled: true }
};

const headers = `# Static response headers for the Sites asset binding.
/*
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()

/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/assets/images/*
  Cache-Control: public, max-age=31536000, immutable
`;

await writeFile(new URL('index.js', serverOutput), worker);
await writeFile(new URL('wrangler.json', serverOutput), `${JSON.stringify(wrangler)}\n`);
await writeFile(new URL('_headers', clientOutput), headers);
await writeFile(new URL('.assetsignore', clientOutput), 'wrangler.json\n.dev.vars\n');

const hosting = JSON.parse(await readFile(new URL('../.openai/hosting.json', import.meta.url), 'utf8'));
if (hosting.d1 !== null || hosting.r2 !== null) {
  throw new Error('CMYKForge is static and must not declare D1 or R2 bindings.');
}

console.log('Built a Sites-compatible Cloudflare Worker artifact in dist/.');

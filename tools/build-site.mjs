import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { transform } from 'lightningcss';
import { minify } from 'terser';

const root = new URL('../', import.meta.url);
const output = new URL('../_site/', import.meta.url);
const productionNames = new Set(['.nojekyll', 'CNAME', 'llms.txt', 'robots.txt', 'sitemap.xml']);
// The repository keeps the original QuickTime source, but production ships the
// fast-start H.264 MP4 that works across current browsers and avoids a full MOV
// download just to read metadata stored at the end of the source file.
const productionExtensions = new Set(['.html', '.mp4', '.webmanifest']);
const sourceOnlyAssets = [
  'images/dev-comparison.avif',
  'images/localai-logo.avif',
  'images/print-cutout.png',
  'images/pro-share-banner.jpg',
  'images/shop-standard-hero.avif',
  'images/shop-standard-hero.jpg',
  'images/standard-art.avif',
  'images/standard-art.jpg',
  'images/standard-badge.avif',
  'images/standard-badge.jpg',
  'images/app-ui/color-profile.png',
  'images/app-ui/filament-profile.png',
  'images/app-ui/print-settings.png',
  'images/partners/README.md',
  'images/real-progress/README.md',
  'images/real-progress/cmykforge-preview.png',
  'images/real-progress/physical-print.jpg'
];
const rootFiles = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => productionNames.has(name) || productionExtensions.has(name.slice(name.lastIndexOf('.'))))
  .sort();

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of rootFiles) {
  await cp(new URL(file, root), new URL(file, output));
}
await cp(new URL('assets/', root), new URL('assets/', output), { recursive: true });
// Keep lossless/source media available to designers in the repository without
// inflating the Pages artifact after every browser-facing reference has moved
// to its verified AVIF derivative.
for (const asset of sourceOnlyAssets) {
  await rm(new URL(`assets/${asset}`, output), { force: true });
}

// Keep authoring sources readable while shipping compact, parse-equivalent CSS
// and JavaScript. GitHub Pages serves these files directly from the artifact.
const cssUrl = new URL('assets/styles.css', output);
const css = await readFile(cssUrl);
const minifiedCss = transform({ filename: 'styles.css', code: css, minify: true });
await writeFile(cssUrl, minifiedCss.code);

const jsUrl = new URL('assets/app.js', output);
const javascript = await readFile(jsUrl, 'utf8');
const minifiedJavaScript = await minify(javascript, { compress: true, mangle: true });
if (!minifiedJavaScript.code) throw new Error('JavaScript minification produced no output');
await writeFile(jsUrl, `${minifiedJavaScript.code}\n`);

// Emit a deterministic inventory so CI and reviewers can confirm exactly what ships.
const inventory = `${rootFiles.join('\n')}\nassets/\n`;
await writeFile(new URL('build-manifest.txt', output), inventory);

const cname = (await readFile(new URL('CNAME', output), 'utf8')).trim();
if (cname !== 'cmykforge.org') {
  throw new Error(`Unexpected CNAME in production build: ${cname}`);
}

console.log(`Built ${join(root.pathname, '_site')} with ${rootFiles.length} root files and assets/.`);

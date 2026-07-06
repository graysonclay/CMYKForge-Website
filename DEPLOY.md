# Deploying CMYKForge to your Squarespace domain

This is a plain static site (HTML/CSS/JS in this repo). The simplest, free, reliable
way to put it on your Squarespace **domain** is to host it on **GitHub Pages** and point
the domain at GitHub with a few DNS records. You keep the domain registered at
Squarespace — only its DNS changes.

> Note: this is a custom multi-page HTML site, so it does **not** run inside the
> Squarespace website builder. Squarespace stays as the domain registrar; GitHub Pages
> serves the pages.

---

## 1. Publish the site on GitHub Pages

1. Merge this branch into `main` (open the PR and merge it).
2. In the repo on GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
   - The included workflow (`.github/workflows/deploy-pages.yml`) publishes the repo
     root on every push to `main`. You can also run it manually from the **Actions** tab
     ("Deploy to GitHub Pages" → *Run workflow*).
4. Wait for the green check in **Actions**. Your site is now live at
   `https://graysonclay.github.io/cmykforge-website/`.

> **Repo must be public** for GitHub Pages on the free plan (or have GitHub Pro for a
> private repo). If it's private and Pages is disabled, make it public first.

---

## 2. Connect your Squarespace domain

Decide which address you want as the primary:

- **Apex** — `yourdomain.com`
- **www** — `www.yourdomain.com`

Set both up so either works.

### 2a. Tell GitHub the domain
In **Settings → Pages → Custom domain**, enter `yourdomain.com` and **Save**.
GitHub writes a `CNAME` file to the repo and will provision a free HTTPS certificate
once DNS resolves.

### 2b. Add the DNS records at Squarespace
In Squarespace: **Settings → Domains → (your domain) → DNS → DNS Settings → Add Record**
(wording may vary slightly). Add:

**Apex `yourdomain.com` — four A records** (Host `@`):

| Type | Host | Value            |
|------|------|------------------|
| A    | @    | 185.199.108.153  |
| A    | @    | 185.199.109.153  |
| A    | @    | 185.199.110.153  |
| A    | @    | 185.199.111.153  |

Optional IPv6 (four AAAA records, Host `@`):

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

**www — one CNAME** (Host `www`):

| Type  | Host | Value                  |
|-------|------|------------------------|
| CNAME | www  | graysonclay.github.io. |

If Squarespace already has default records on `@` or `www` that conflict (for example a
parking or "Squarespace Domains" A/CNAME record), remove those so only the records above
remain.

### 2c. Finish
- DNS can take from a few minutes up to ~24 hours to propagate.
- Back in **Settings → Pages**, once the domain check passes, tick **Enforce HTTPS**.
- Visit `https://yourdomain.com` — you should see the site, with the home page at `/`.

---

## Notes & gotchas

- **Domain attached to a Squarespace *site*?** If the domain is currently connected to a
  live Squarespace website, that site may control the DNS. Either disconnect it from that
  site first, or make sure you're editing the domain's **DNS Settings** (custom records)
  and remove the records Squarespace points at its own servers. The four A records above
  must be the ones answering for `@`.
- **Nameservers.** Keep the domain on Squarespace's default nameservers and just edit the
  DNS records as above. (Only switch nameservers if you intend to manage DNS elsewhere,
  e.g. Cloudflare.)
- **`cmykforge-website.html`** is kept as a redirect to `/` (`index.html`) so any old
  link to it still lands on the home page.
- **Updating the site:** push to `main` (or merge a PR). The Pages workflow redeploys
  automatically — no Squarespace changes needed after the first setup.

## Alternatives (if you'd rather not use GitHub Pages)

- **Cloudflare Pages** or **Netlify** — connect this GitHub repo, they build/serve it,
  then add the same style of DNS records at Squarespace. Also free.
- All three work the same way from Squarespace's side: point DNS at the host.

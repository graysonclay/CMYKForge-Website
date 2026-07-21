# Squarespace Domains DNS cutover for CMYKForge

No DNS change is authorized by this document. Use it only after the owner explicitly approves launch. If Squarespace must be opened, use Google Chrome.

## Current GitHub Pages hosting records

Observed on 2026-07-21:

| Type | Host/name | Current value | Purpose |
|---|---|---|---|
| A | `@` | `185.199.108.153` | GitHub Pages apex |
| A | `@` | `185.199.109.153` | GitHub Pages apex |
| A | `@` | `185.199.110.153` | GitHub Pages apex |
| A | `@` | `185.199.111.153` | GitHub Pages apex |
| CNAME | `www` | `graysonclay.github.io.` | GitHub Pages `www` |
| Repository file | `CNAME` | `cmykforge.org` | Associates the GitHub Pages deployment with the custom apex |

No apex AAAA records were returned during the audit. Confirm the Squarespace panel before cutover because the panel is the source of truth.

## Exact Sites records

The values below must be populated only from the CMYKForge Site’s **Add domain** response. Never infer them.

| Type | Host/name | Current value | New value | Action | Reason |
|---|---|---|---|---|---|
| A | `@` | `185.199.108.153` | **Pending Sites apex target** | Replace/remove at cutover | Conflicts with Sites apex routing |
| A | `@` | `185.199.109.153` | **Pending Sites apex target** | Replace/remove at cutover | Conflicts with Sites apex routing |
| A | `@` | `185.199.110.153` | **Pending Sites apex target** | Replace/remove at cutover | Conflicts with Sites apex routing |
| A | `@` | `185.199.111.153` | **Pending Sites apex target** | Replace/remove at cutover | Conflicts with Sites apex routing |
| CNAME | `www` | `graysonclay.github.io.` | **Pending Sites CNAME target** | Replace at cutover | Routes `www` to Sites |
| TBD | Supplied by Sites | None/current panel value | **Pending Sites validation value** | Add | Proves domain control and provisions routing/SSL |

The exact Sites values will be inserted after the owner-only Site has been deployed and the domain has been added in Site settings. Do not proceed while any value still says **Pending**.

## Records that must not be changed

Keep every email and unrelated verification record, including:

- MX records, including the observed priority `1` value `smtp.google.com.`.
- SPF TXT: `v=spf1 include:_spf.google.com ~all`.
- Every DKIM TXT/CNAME record, regardless of selector name.
- DMARC TXT at `_dmarc`: `v=DMARC1; p=none; rua=mailto:dmarc@cmykforge.org; pct=100`.
- Search Console TXT: `google-site-verification=980nAsy4Kg2NtQ_K8gDlHiuepJC09QViSUW6B3BELL0`.
- Any unrelated Google Workspace, email, social, security, or service-verification record.
- Nameservers.

Take a screenshot or export of the complete DNS panel before changing anything.

## Squarespace click-by-click instructions

Labels can vary slightly with Squarespace UI updates. Use the labels visible in the account and stop if the record set differs materially from this audit.

1. In Google Chrome, sign in to Squarespace.
2. Open **Domains**.
3. Select **cmykforge.org**.
4. Open **DNS Settings**. Depending on the account view, this may appear under **Domain settings** or **Advanced settings**.
5. Under **Custom records**, locate the four apex A records whose host is `@` and values begin `185.199.*.153`, plus the `www` CNAME pointing to `graysonclay.github.io`.
6. Compare the entire panel against the pre-cutover screenshot/export. Identify MX, SPF, DKIM, DMARC, Search Console, and other verification records; mark them “keep.”
7. Choose **Add record** and add every exact validation record supplied by Sites.
8. Add the exact Sites apex A target or targets supplied for `cmykforge.org`.
9. Replace the `www` CNAME with the exact Sites CNAME target supplied for `www.cmykforge.org`.
10. Remove only the GitHub Pages A records that conflict with the new Sites apex A records.
11. Do not remove MX, SPF, DKIM, DMARC, Search Console, or unrelated verification records.
12. Save each change, then review the final list before leaving the page.
13. Return to the CMYKForge Site settings and refresh/verify each custom domain.
14. Do not consider cutover complete until Sites reports the domain and SSL active.

## Propagation and testing

DNS changes may appear within minutes but cached answers can persist for hours; allow up to 24–48 hours for all resolvers. During a migration, different visitors may temporarily reach different hosts.

Confirm authoritative behavior:

```sh
dig +short cmykforge.org A
dig +short www.cmykforge.org CNAME
curl -I https://cmykforge.org/
curl -I https://www.cmykforge.org/standard.html?dns-check=1
```

Expected:

- Apex A answers exactly match the Sites-provided targets.
- `www` CNAME exactly matches the Sites-provided target.
- Apex HTTPS returns HTTP 200 with the approved site.
- `www` returns one redirect to the apex while preserving path and query.
- The browser shows a valid certificate for both names.

Broken-DNS warning signs:

- `NXDOMAIN` or no A/CNAME answer.
- Certificate mismatch or persistent SSL provisioning error.
- Redirect loop between apex and `www`.
- Some resolvers still return GitHub after the expected TTL window.
- Email delivery problems, which indicate an email record was changed and require immediate rollback of that record.

## Rollback to GitHub Pages

If a core issue appears after cutover:

1. Restore these apex A records with host `@`:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
2. Restore `www` CNAME to `graysonclay.github.io.`.
3. Remove only conflicting Sites hosting records. Leave email and verification records untouched.
4. Confirm the repository `CNAME` still contains `cmykforge.org`.
5. Confirm GitHub **Settings → Pages** still shows the custom domain and HTTPS.
6. Wait for DNS caches and test both hostnames again.
7. Restrict the Sites deployment after GitHub Pages is confirmed live.

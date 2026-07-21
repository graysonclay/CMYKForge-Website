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

Sites supplied these values on 2026-07-21 after both hostnames were attached in pending state. They have **not** been entered in Squarespace. Both domains will remain pending and SSL will remain initializing until an approved DNS cutover.

| Type | Host/name | Current value | New value | Action | Reason |
|---|---|---|---|---|---|
| A | `@` | `185.199.108.153` | — | Remove at cutover | GitHub Pages apex record conflicts with Sites |
| A | `@` | `185.199.109.153` | — | Remove at cutover | GitHub Pages apex record conflicts with Sites |
| A | `@` | `185.199.110.153` | — | Remove at cutover | GitHub Pages apex record conflicts with Sites |
| A | `@` | `185.199.111.153` | — | Remove at cutover | GitHub Pages apex record conflicts with Sites |
| A | `@` | None | `162.159.143.30` | Add at cutover | Sites apex routing target |
| A | `@` | None | `172.66.3.26` | Add at cutover | Sites apex routing target |
| CNAME | `www` | `graysonclay.github.io.` | `custom-domains.chatgpt.site.` | Replace at cutover | Routes `www` to Sites |
| TXT | `_openai-site-verification.cmykforge.org` | None/current panel value | `openai-site-verification=xNvFDoSxvOC4t_wlVNceE4TxYR6sFVoNDWS90yn_sJI` | Add before or at cutover | Sites ownership validation for apex |
| TXT | `_cf-custom-hostname.cmykforge.org` | None/current panel value | `d645971a-a5f9-4008-b70b-9542813c8125` | Add before or at cutover | Certificate/routing validation for apex |
| TXT | `_openai-site-verification.www.cmykforge.org` | None/current panel value | `openai-site-verification=hAsiflhze9zcroN71rZWI5FkhCXssmk9uMoueQgZ_ZE` | Add before or at cutover | Sites ownership validation for `www` |
| TXT | `_cf-custom-hostname.www.cmykforge.org` | None/current panel value | `f0616f5b-b5cb-42c5-85e7-ae9ec8f4643d` | Add before or at cutover | Certificate/routing validation for `www` |

The table uses the fully qualified TXT names returned by Sites. Squarespace commonly appends the domain automatically: if its **Host** field does so, enter the relative labels `_openai-site-verification`, `_cf-custom-hostname`, `_openai-site-verification.www`, and `_cf-custom-hostname.www`. Confirm the resulting displayed names exactly match the table before saving.

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
7. Choose **Add record** and add the four exact TXT validation records in the table above.
8. Add the two apex A records `162.159.143.30` and `172.66.3.26` for host `@`.
9. Replace the `www` CNAME with `custom-domains.chatgpt.site.`.
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

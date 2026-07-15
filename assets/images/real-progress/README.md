# Real CMYKForge Progress — image drop-in guide

This folder holds the **genuine** media shown in the "Real CMYKForge Progress"
section (hidden on the live site until real assets exist).

> Do **not** put stock photos, AI-generated images, simulated screenshots, or
> mockups here. This section only exists to show real software builds, real
> slicer results, and real physical prints.

## Expected files

| Filename              | Shown as         | Where it appears                                   |
|-----------------------|------------------|----------------------------------------------------|
| `original-image.webp` | Original Image    | `index.html` + `standard.html` evidence block (step 1) |
| `cmykforge-preview.webp` | CMYKForge Preview (SIMULATED) | evidence block (step 2) — labelled "Simulated" |
| `physical-print.webp` | Physical Print    | `index.html` + `standard.html` evidence block (step 3) |
| `creator-photo.webp`  | Creator photo     | `about.html` → "About the Creator" (hidden until added) |

## Recommended specs

- **Minimum width:** 1400px
- **Preferred aspect ratio:** 4:3 or 3:2
- **Format:** WebP preferred.
  - JPG accepted for **photographs** (physical print, creator photo)
  - PNG accepted for **interface screenshots** (app build) where sharp text matters
- Keep each optimized file ideally under ~300 KB.

## How to enable the section (once real images are added)

1. Add the real files above into this folder.
2. Open `index.html` and `standard.html`, find `<section id="real-progress" hidden ...>`
   and **remove the `hidden` attribute**.
3. In `about.html`, find the creator-photo figure marked
   `<!-- CREATOR PHOTO: remove hidden once a real approved photo exists -->`
   and remove its `hidden` attribute after adding `creator-photo.webp`.
4. Update the **alt text** on each `<img>` to describe the real content
   (alt text lives in the `alt="..."` attribute on each image).
5. Review and replace the **captions** — they are marked
   `<!-- CAPTION TEMPLATE — review before publishing -->` and must be rewritten
   to describe the actual image.

## Optimize before publishing

- Resize to the target width (≈1600px is a good ceiling for these blocks).
- Convert to WebP, e.g. `cwebp -q 82 input.png -o app-build.webp`
  (photos: `cwebp -q 78`).
- Add matching `width`/`height` attributes to each `<img>` to avoid layout shift.
- Keep the poster/hero media eager; these below-the-fold images use
  `loading="lazy"`.

## Caption templates (review each before it goes public)

- **Current App Build:** "A real screenshot from the current CMYKForge development build."
- **Slicer Result:** "A CMYKForge-generated model opened in a multi-material slicing workflow."
- **Physical Print:** "A real physical print produced from a CMYKForge-generated project."

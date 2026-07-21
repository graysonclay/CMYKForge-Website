# Real CMYKForge Progress — image drop-in guide

This folder holds the **genuine** media shown in the live homepage comparison
and the Standard page's "Real CMYKForge Progress" section.

> Do **not** put stock photos, AI-generated images, simulated screenshots, or
> mockups here. This section only exists to show real software builds, real
> slicer results, and real physical prints.

## Expected files

| Filename              | Shown as         | Where it appears                                   |
|-----------------------|------------------|----------------------------------------------------|
| `original-image.avif` | Original Image    | `index.html` + `standard.html` evidence block (step 1) |
| `cmykforge-preview.avif` | CMYKForge Preview (SIMULATED) | evidence block (step 2) — labelled "Simulated" |
| `physical-print.avif` | Physical Print    | `index.html` + `standard.html` evidence block (step 3) |
| `creator-photo.webp`  | Creator photo     | `about.html` → "About the Creator" (hidden until added) |

## Recommended specs

- **Minimum width:** 1400px
- **Preferred aspect ratio:** 4:3 or 3:2
- **Format:** WebP preferred.
  - JPG accepted for **photographs** (physical print, creator photo)
  - PNG accepted for **interface screenshots** (app build) where sharp text matters
- Keep each optimized file ideally under ~300 KB.

The three progress files above are already approved and live. Keep their source
PNG/JPEG counterparts for future re-encoding, but browser pages should reference
the optimized AVIF files.

## Adding or replacing approved media

1. Add the real files above into this folder.
2. Update the matching `index.html` and `standard.html` image references,
   intrinsic dimensions, alternative text, and captions.
3. For a creator portrait, find the `about.html` figure marked
   `<!-- CREATOR PHOTO: remove hidden once a real approved photo exists -->`
   and remove its `hidden` attribute after adding `creator-photo.webp`.
4. Update the **alt text** on each `<img>` to describe the real content
   (alt text lives in the `alt="..."` attribute on each image).
5. Review every caption so it describes the actual image and continues to label
   simulated content explicitly.

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

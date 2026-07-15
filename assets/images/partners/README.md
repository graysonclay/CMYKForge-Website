# Worked With / Featured Creators — drop-in guide

This folder holds logos/photos for the **"Worked With"** section (hidden on the
live site until you have real partners or creators to show).

> Only add **real** partners, collaborators, or creators who have actually
> worked with CMYKForge and are okay being listed. No stock logos, no invented
> brands, no placeholder names. An empty reserved section is fine; a fake one
> is not.

## Expected files

- One image per partner/creator, e.g. `partner-1.webp`, `creator-name.webp`.
- Prefer WebP or transparent PNG for logos. Square-ish (e.g. 400×400) works best
  in the card grid.

## How to enable the section

1. Add real logo/photo files to this folder.
2. Open `index.html`, find `<section id="partners" ... hidden>` and:
   - remove the `hidden` attribute,
   - replace the example `<figure class="partner-card">` blocks with real ones
     (real name, real image `src`, real `alt`, and a real link if they have one),
   - delete any unused example cards.
3. Keep the intro copy honest — describe the actual relationship (tested with,
   collaborated with, featured creator, etc.).

Do not enable this section with placeholder or fabricated entries.

# Design source files

Originals supplied by the client. Nothing in here is served to the browser.

- `grow-icon.png` — the three-figures growth mark. Redrawn as clean vector
  geometry in `src/components/motif/growth-figures.tsx` and `public/icon.svg`.
- `grow-icon-traced.svg` — an auto-traced version of the same PNG. Not used:
  180 kB across 2,642 noisy paths, with a baked-in white background and no way
  to inherit `currentColor`, so it could not follow the light/dark theme. The
  redrawn version is under 1 kB and scales cleanly from 16px upward.
- `monthly-opd-clinics-poster.jpg` — source for the seven visiting OPD clinics
  in `outreachClinics` (see `src/lib/site.ts`).

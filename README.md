# Silvia Salinas Mulder — "The Field Record"

An interactive, bilingual (EN/ES) portfolio built as an **ethnographic dossier in six entries**.
Single-page site, fully self-contained, no build step.

## Concept
The site treats Silvia's career like an anthropologist's field record:
- **Entry 01 — The Subject** (biography, "Plate" portrait frame)
- **Entry 02 — The Practice** (four practice areas, horizontal-scroll on desktop)
- **Entry 03 — The Reckoning** (animated figures + scrolling marquee)
- **Entry 04 — The Record** (flagship evaluations, magazine-style table)
- **Entry 05 — The Field Sites** (interactive world map → filters case files)
- **Entry 06 — The Writings** (selected publications)
- **Contact** ("An open file")

## How to run
Just open `index.html` in a browser, or host the whole folder anywhere
(GitHub Pages, Netlify, Vercel — drag-and-drop the folder).

GitHub Pages: push this folder to a repo, then Settings → Pages → deploy from `main` / root.

## Tech
- Type: Cormorant Garamond (display) · Jost (sans) · JetBrains Mono (labels/coordinates)
- Motion: GSAP + ScrollTrigger (bundled locally in `/assets`, no CDN needed)
- Hero background: a **raw-WebGL fragment shader** rendering animated topographic
  iso-contours (mouse-reactive), with an automatic fallback to a 2D canvas if WebGL
  is unavailable. No library — ~3KB of shader code.
- No frameworks, no build, no tracking.

## Files
```
index.html              The page
assets/style.css         All styling
assets/data.js           Content (assignments, publications, countries) — EDIT HERE
assets/preloader.js      Loading counter + custom cursor
assets/hero-webgl.js     WebGL contour shader hero (+ canvas fallback)
assets/main.js           Rendering, GSAP choreography, map filter, counters, language
assets/gsap.min.js       GSAP (bundled)
assets/ScrollTrigger.min.js
```

## To swap in a real photo of Silvia
In `index.html`, Entry 01, find the `.plate` block. Replace the `.plate-ph` div with:
```html
<img class="plate-img" src="assets/silvia.jpg" alt="Silvia Salinas Mulder">
```
Drop the image into `/assets` as `silvia.jpg`. A 4:5 portrait works best.
(Don't hotlink the Wix CDN — download and self-host so it never breaks.)

## To edit content
All content lives in `assets/data.js`, with EN/ES pairs. Add or change
assignments, publications, figures and practice areas there.

## Notes on the numbers
The big figures use Silvia's own stated headline claims (35+ years, 100+
assignments, 40+ publications, 25+ countries). The map and case files are
populated only with assignments that have a verifiable country in the CV.
Silvia's catalytic-A bio states "20+ countries"; the "25+" here follows the
CV's country-experience list. Adjust in `assets/data.js` (FIGURES) if preferred.

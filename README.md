# My Nest Designer

An interactive 3D floor plan viewer for residential plots — built for owners who want to walk through their home before it's built.

**Live demo (plot 63 HB):** https://vigsank.github.io/my-nest-designer/

---

## What it does

- **3D model** of your floor plan — walls, windows, doors, columns, staircase, site
- **Walk inside** — first-person navigation through every room
- **Furniture** — adjustable sizes via sliders (dining table, sofa, bed, kitchen counter)
- **Cutaway view** — slice the model at 5' to see inside from above
- **Ruler** — click and drag to measure any distance in the model
- **Room labels** — click any room to see its dimensions and furniture list
- **Window labels** and **markup annotations** from hand-drawn plan notes
- Works on desktop and mobile, no app install needed

---

## Adapting this for your plot

This project is designed so any plot owner in the same society (or anywhere) can fork it and model their own plan. Here's how.

### What you'll need

1. A scanned image of each floor plan (phone photo of the architect drawing is fine)
2. ~2–3 hours of work with an AI assistant (Claude Code or similar) to trace the walls

### Step 1 — Fork and clone

```bash
git clone https://github.com/<your-username>/my-nest-designer.git
cd my-nest-designer
npm install
npm start          # opens at http://localhost:3000
```

### Step 2 — Add your reference files

Drop your scans into `assets/reference/`:

```
assets/reference/
  G Floor.jpg          ← ground floor plan scan
  F Floor.jpg          ← first floor plan scan (if available)
  S Floor.jpg          ← site plan scan (if available)
  Window Legend.jpg    ← joinery schedule / window-door dimension table
```

These files are never modified — they are your source of truth.

### Step 3 — Calibrate the coordinate system

Open `src/core/coords.js`. You need to find three numbers from your ground floor scan:

```js
export const S = 29.5;   // ← pixels per foot in YOUR scan
export const FL = 1.5;   // ← plinth height in feet (ask your engineer)
export const H = 10;     // ← floor-to-slab height in feet
export const TH = 16;    // ← wall thickness in pixels in YOUR scan
```

**How to find `S` (scale):**
- Open your scan in any image viewer
- Find a dimension you know — e.g. a room stated as 10' wide
- Measure how many pixels wide it is in the image
- `S = pixels / feet`

**How to find the origin (`OX`, `OZ`):**
- These are the pixel coordinates of the northwest (top-left) corner of your plot boundary
- Also in `coords.js` — update `fx` and `fz`:

```js
export const fx = p => (p - OX) / S;   // replace OX with your value
export const fz = p => (p - OZ) / S;   // replace OZ with your value
```

For reference, plot 63 HB uses `S=29.5`, `OX=156`, `OZ=648`.

### Step 4 — Describe your rooms to an AI

The easiest way to model your plan is to open the project in Claude Code and say:

> "Here is my ground floor scan [attach image]. Trace all the walls into `src/floors/ground/structure.js` using the `wall()` and `pb()` helpers. Each room should get its own file under `src/floors/ground/rooms/`."

The AI will read `CLAUDE.md` (which explains the coordinate system and all helpers) and do the tracing. You review and correct.

Alternatively, read `CLAUDE.md` and trace walls manually — the `wall()` function call is:

```js
wall(g, isVertical, coordPixel, startPixel, endPixel, openings, M);
```

Where `openings` is an array of doors/windows along that wall segment. See `src/floors/ground/structure.js` for examples.

### Step 5 — Update room data

Edit `src/floors/ground/index.js`:
- `ROOMS` array — your room names, approximate dimensions, bounding boxes (used for walk mode room detection and HUD)
- `ROOM_LBLS` — label positions for each room
- `WIN_LBLS` — window label positions
- `MK_LBLS` — any markup annotation labels

### Step 6 — Add furniture

Each room file under `src/floors/ground/rooms/` exports a `build(g, M, FP, addFurnSOL)` function. Add boxes for your furniture using `box()` and `pb()` helpers. The `FP` object holds live slider values (dining table size, sofa size, etc.) — update `src/ui/sliders.js` if your furniture parameters differ.

### Step 7 — Deploy to GitHub Pages

```bash
git add .
git commit -m "Add my floor plan"
git push
```

Then in your GitHub repo settings → Pages → Source: `main` branch, `/ (root)`. Your 3D model will be live at `https://<username>.github.io/my-nest-designer/`.

---

## Project structure (for developers)

```
src/
  main.js              — entry point
  scene.js             — Three.js renderer, camera, lights, render loop
  state.js             — shared app state (toggles, collision boxes, furniture params)
  core/
    coords.js          — scale, origin, coordinate transforms  ← adapt this for your plot
    materials.js       — all 45 materials
    geometry.js        — box, cylinder, sphere helpers
    joinery.js         — wall(), window/door drawing helpers
  floors/
    ground/            — one folder per floor
      index.js         — ROOMS data, label positions, buildFloor()
      structure.js     — all walls, floors, columns, stair, roof  ← main file to edit
      site.js          — exterior: paving, trees, car
      rooms/           — one file per room, furniture only
  ui/
    labels.js          — room labels, window labels, room detail cards
    walkMode.js        — first-person navigation
    ruler.js           — click-drag measurement tool
    sliders.js         — furniture size controls
    controls.js        — toolbar buttons, keyboard, touch pad
assets/
  reference/           — your floor plan scans and original HTML files (read-only)
```

No bundler. No framework. Plain ES modules + Three.js r128 via CDN importmap.

---

## Joinery types

When tracing walls, openings use these type codes (`k` field):

| Code | Type | Typical size |
|---|---|---|
| `'door'` | Hinged door | 3'×7' internal, 4'×7' main |
| `'win'` | Fixed/casement window | varies |
| `'sd'` | Sliding door | 6'×7' |
| `'fg'` | Full glazing panel | 4'×8' |
| `'v1'` | Ventilation louvre | 2'×2' |

Add `mk:1` to any opening that's a pen markup / annotation (shows in purple when Markups is toggled on).

---

## Local dev requirements

- Node.js (any recent version — only used to run the `serve` dev server)
- A modern browser (Chrome, Firefox, Safari, Edge)
- No other dependencies

```bash
npm install    # installs serve
npm start      # http://localhost:3000
```

---

## Using this as a template

This repository is the **personal project of plot 63 HB's owner** and is not open for contributions.

- **Do not open pull requests** — they will not be reviewed or merged
- **Do not open issues** — this repo has no maintainer role for external requests
- **Fork freely** — fork the repo, make it entirely your own, model your plot, deploy your own GitHub Pages. That is the intended use.

Your fork is yours. There is no expectation to contribute back.

---

## Credits

Built by the owner of plot 63 HB as a personal home-planning tool, shared as a template for neighbours and anyone else building their nest.

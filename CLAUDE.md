# My Nest Designer — Project Instructions

## What this project is

A 3D interactive floor plan viewer for residential plots — designed for reuse by any plot owner.
Built with Three.js r128 (native ES modules, no bundler). Hosted on GitHub Pages. No build step needed.

Each plot owner keeps their own floor plan scans and reference HTML files under `assets/reference/`.
All plot-specific geometry lives under `src/floors/`. The engine (`src/core/`, `src/ui/`, `src/scene.js`,
`src/state.js`) is fully generic and shared across plots/floors.

**This instance**: Plot 63 HB, a 30' × 50' residential plot. Ground floor modelled.
Future floors (first floor, terrace) follow the same pattern under `src/floors/first/`, `src/floors/terrace/`.

## Reference files (`assets/reference/`)

Place your own plot's files here. This folder is **read-only** — never modify files once added,
they are the historical record and source of truth for coordinates.

| Convention | Purpose |
|---|---|
| `*Ground Floor 3D*.html` | Latest single-file 3D version — used to extract/verify geometry |
| `G Floor.jpg` (or similar) | Scanned ground floor plan. Pixel coords from this image drive all geometry. |
| `F Floor.jpg` | First floor scan |
| `S Floor.jpg` | Site / plot plan scan |
| `Window Measurements Legend.jpg` | Joinery schedule — window/door type labels and dimensions |

For plot 63 HB specifically:
- `63 HB Ground Floor 3D v3.html` — primary geometry reference (latest)
- `63 HB Ground Floor 3D v1/v2.html` — older versions for archaeology

## Coordinate system (how to calibrate for a different plot)

All geometry is derived from pixel coordinates in the scanned floor plan image.
To adapt for a new plot, measure the following from your scan:

```
S  = px/ft          — how many pixels = 1 foot in your scan (measure a known dimension)
OX = pixel X of plot's northwest corner (left edge of outer wall)
OZ = pixel Z of plot's northwest corner (top edge of outer wall)

fx(p) = (p - OX) / S    (pixel X → Three.js world X, east-west)
fz(p) = (p - OZ) / S    (pixel Z → Three.js world Z, north-south)

FL = finished floor level above ground, in feet  (typically 1.0–1.5 for Indian construction)
H  = floor-to-slab height in feet                (typically 10')
TH = wall thickness in pixel units               (measure from scan; typically 12–18 px)
```

For plot 63 HB: `S=29.5`, `OX=156`, `OZ=648`, `FL=1.5`, `H=10`, `TH=16`.

Update these values in `src/core/coords.js` when adapting for a new plot.
All other files derive everything from those constants — no other file needs changing for scale/origin.

## Project structure

```
src/
  main.js              — entry point, wires all modules
  scene.js             — renderer, camera, lights, OrbitControls, render loop
  state.js             — shared mutable state: appState { st, CAP, SOL, SOLX, FP }
  core/
    coords.js          — S, FL, H, TH, fx, fz, fz_inv
    materials.js       — createMaterials() → M (45 named materials), std helper
    geometry.js        — box, pb, sb, cyl, ball, disposeGroup
    joinery.js         — frameBars, ventBars, glassPane, wall, doorLeaf, doorArc
  floors/
    ground/
      index.js         — buildFloor(), ROOMS data, label arrays (ROOM_LBLS, WIN_LBLS, MK_LBLS)
      structure.js     — buildStructure(): all walls, floors, columns, stair, lift, roof
      site.js          — buildSite(): exterior paving, trees, car → returns carGrp
      rooms/           — one file per room, each exports build(g, M, FP, addFurnSOL)
        pooja.js, dining.js, kitchen.js, utility.js, living.js, foyer.js,
        porch.js, powder.js, toilet.js, bedroom1.js, bath.js, stairLift.js
  ui/
    labels.js          — buildLabels, updateLabels, room detail cards
    walkMode.js        — walk state, collision, camera, HUD
    ruler.js           — measurement tool (SVG overlay, badges, raycasting)
    sliders.js         — furniture size sliders
    controls.js        — toolbar button wiring, setMode, keyboard/pad events
```

## State management

All shared mutable state lives in `appState` (exported from `src/state.js`):

- `appState.st` — UI toggle flags: `{ mode, cut, roof, furn, labels, winlabels, marks, hud, car }`
- `appState.CAP` — cutaway height cap in feet (1e9 = no cap, FL+3.5 = cutaway mode)
- `appState.SOL` — structural collision boxes, reset each `buildStructure()` call
- `appState.SOLX` — furniture + site obstacle boxes (persistent, cleared on furniture rebuild)
- `appState.FP` — live furniture parameters: `{ diningW, diningD, sofaW, sofaD, bedW, bedD, counterD }`

**Never reassign `appState.SOL = []`** — use `appState.SOL.length = 0` so references held by
walk mode stay valid.

## Geometry helpers

- `box(g, x0, x1, z0, z1, y0, y1, m, o)` — core box mesh in world coords. `o.s=1` enables cutaway cap. `o.ns=1` disables shadow.
- `pb(g, a, b, c, d, y0, y1, m, o)` — pixel-coord wrapper for `box` (runs `fx`/`fz`)
- `sb(g, ...)` — like `pb` but always cutaway-aware (`o.s=1`)
- `cyl(g, x, y, z, r, h, m, seg, sx, sz)` — cylinder
- `ball(g, x, y, z, r, m, sy)` — icosahedron (trees, planters)

## Joinery schedule (door/window types)

| Type | Dimensions | Notes |
|---|---|---|
| MD | 4'×7' | Main door |
| D | 3'×7' | Internal door |
| D1 | 2'6"×7' | Narrow internal door |
| W | 4'×4' | Standard window |
| W1 | 2'×4' | Narrow window |
| W2 | 6'×4' | Wide garden window |
| W3 | 2'×8' | Tall window |
| W4 | 2'×4' | Bathroom window |
| FG | 4'×8' | Full glazing |
| SD | 6'×7' | Sliding door |
| V1 | 2'×2' | Ventilation louvre |

In `wall()` ops, `k` = type key (`'win'`, `'sd'`, `'fg'`, `'v1'`, `'door'`).
`mk:1` on an op means it is a **pen markup** (highlighted in purple when Markups toggle is on).

## Adding a new floor

1. Create `src/floors/first/` directory
2. Add `structure.js`, `site.js`, `rooms/*.js` following the ground floor pattern
3. Add `index.js` exporting `buildFloor(scene, M, appState)` and the floor's `ROOMS` data
4. Import and call it from `src/main.js` alongside the ground floor

## Dev workflow

```bash
cd "My Nest Designer"
npm install        # first time only
npm start          # serves at http://localhost:3000
```

No build step. Edit any `src/` file, refresh the browser.
For GitHub Pages: push to `main`, enable Pages on repo root — `.nojekyll` is already present.

## Key design decisions

- **No bundler** — native ES modules + importmap pointing Three.js r128 to CDN (jsdelivr). Works both locally and on GitHub Pages.
- **Plain JS, no React** — the UI is tightly coupled to the Three.js render loop (per-frame label projection, SVG ruler overlay). React would add complexity with no benefit.
- **One room file per room** — keeps geometry changes isolated. Each room file is independently editable without touching shared structure.
- **`appState` singleton** — ES modules are singletons, so every module importing `appState` shares the same object. No pub/sub needed.
- **Pen markup convention** — any geometry that reflects a hand-drawn annotation on the scan gets `mk:1` in its wall op. Markups toggle highlights these in purple glass.

## Intentions & roadmap

This tool is for residential plot owners to:
1. **Visualise and validate their floor plan** — check room sizes, furniture fit, window placement, walkability
2. **Communicate with architects/contractors** — share a GitHub Pages URL instead of flat PDFs
3. **Plan iteratively** — adjust furniture via sliders, toggle cutaway/roof, walk through rooms
4. **Extend floor by floor** — add first floor, terrace as the build progresses

**Plot 63 HB current state**: ground floor and first floor fully modelled. All toolbar features functional.

## Joinery tooltip rule

Every `wall()` op **must** include a `label:` string (e.g. `label:"W1 2'×4'"`, `label:"D 3'×7'"`).
The engine automatically tags the glass pane mesh (`userData.joinery`) or creates an invisible
hit-target box for door openings with that label. `src/ui/joinery-tooltip.js` reads
`userData.joinery` via raycasting to show hover/tap dimension tooltips — this works across all
floors automatically.

Rules:
- Never omit `label:` on a `wall()` op. If a type has no label yet, use the joinery schedule key
  (e.g. `label:"V1 2'×2'"`).
- Never rename or remove `userData.joinery` from joinery meshes.
- When adding new floors or new joinery types, always supply `label:` on every op.

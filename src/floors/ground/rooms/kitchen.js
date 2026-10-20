import { fx, fz, FL } from '../../../core/coords.js';
import { box, pb, cyl } from '../../../core/geometry.js';

// ─── helpers ────────────────────────────────────────────────────────────────

// Horizontal handle bar running X-axis (on south-facing cabinet)
function handleX(g, x0, x1, z, y, M) {
  box(g, x0+0.05, x1-0.05, z-0.03, z+0.03, y, y+0.06, M.chrome, {ns:1});
  box(g, x0+0.03, x0+0.08, z-0.05, z+0.05, y-0.02, y+0.08, M.chrome, {ns:1});
  box(g, x1-0.08, x1-0.03, z-0.05, z+0.05, y-0.02, y+0.08, M.chrome, {ns:1});
}

// Vertical handle bar running Z-axis (on west-facing cabinet)
function handleZ(g, z0, z1, x, y, M) {
  box(g, x-0.03, x+0.03, z0+0.05, z1-0.05, y, y+0.06, M.chrome, {ns:1});
  box(g, x-0.05, x+0.05, z0+0.03, z0+0.08, y-0.02, y+0.08, M.chrome, {ns:1});
  box(g, x-0.05, x+0.05, z1-0.08, z1-0.03, y-0.02, y+0.08, M.chrome, {ns:1});
}

// Cabinet door gap line (south-facing row, splits at midX)
function doorLineX(g, x0, x1, zFace, y0, y1, M) {
  const mx = (x0 + x1) / 2;
  box(g, mx-0.01, mx+0.01, zFace-0.01, zFace+0.01, y0, y1, M.dark, {ns:1});
  box(g, x0+0.01, x1-0.01, zFace-0.015, zFace+0.015, y0, y0+0.01, M.dark, {ns:1});
  box(g, x0+0.01, x1-0.01, zFace-0.015, zFace+0.015, y1-0.01, y1, M.dark, {ns:1});
}

// Cabinet door gap line (west-facing row, splits at midZ)
function doorLineZ(g, z0, z1, xFace, y0, y1, M) {
  const mz = (z0 + z1) / 2;
  box(g, xFace-0.015, xFace+0.015, mz-0.01, mz+0.01, y0, y1, M.dark, {ns:1});
  box(g, xFace-0.015, xFace+0.015, z0+0.01, z1-0.01, y0, y0+0.01, M.dark, {ns:1});
  box(g, xFace-0.015, xFace+0.015, z0+0.01, z1-0.01, y1-0.01, y1, M.dark, {ns:1});
}

// ─── main build ─────────────────────────────────────────────────────────────

export function build(g, M, FP, addFurnSOL) {
  const cd = FP.counterD;
  const S = 29.5;

  // ════════════════════════════════════════════════════════════════
  // WEST COUNTER ARM  (facing dining — geometry unchanged, detail added)
  // ════════════════════════════════════════════════════════════════
  const wx0 = fx(657), wx1 = fx(657) + cd;
  const wz0 = fz(832),  wz1 = fz(1022);
  pb(g, 657, 832, Math.round(657+cd*S), 1022, FL,       FL+2.95, M.wood_oak);
  pb(g, 657, 832, Math.round(657+cd*S), 1022, FL+2.95,  FL+3.1,  M.granite, {ns:1});
  // door gap + handle (faces east into kitchen)
  doorLineZ(g, wz0+0.1, wz1-0.1, wx1, FL+0.05, FL+2.9, M);
  handleZ(g, (wz0+wz1)/2-0.35, (wz0+wz1)/2+0.35, wx1+0.04, FL+1.4, M);

  // ════════════════════════════════════════════════════════════════
  // NORTH WALL  (counter faces south)
  // Layout along X: [west cab][hob cab][sink cab][right cab]
  // ════════════════════════════════════════════════════════════════
  const nz0 = fz(832), nz1 = nz0 + cd;
  const nFace = nz1; // south-facing face Z

  // ── base cabinet body ──
  box(g, fx(657), fx(976), nz0, nz1, FL, FL+2.95, M.wood_oak);
  box(g, fx(657), fx(976), nz0, nz1, FL+2.95, FL+3.1, M.granite, {ns:1});

  // door gaps + handles across north base (3 equal doors)
  const nw = fx(976) - fx(657);
  const nd = nw / 3;
  const nx0 = fx(657);
  for (let i = 0; i < 3; i++) {
    const dx0 = nx0 + i*nd, dx1 = nx0 + (i+1)*nd;
    // vertical gap between doors
    box(g, dx1-0.01, dx1+0.01, nFace-0.02, nFace, FL+0.05, FL+2.9, M.dark, {ns:1});
    // top + bottom edge shadow lines
    box(g, dx0+0.02, dx1-0.02, nFace-0.02, nFace, FL+0.05, FL+0.07, M.dark, {ns:1});
    box(g, dx0+0.02, dx1-0.02, nFace-0.02, nFace, FL+2.88, FL+2.9, M.dark, {ns:1});
    // handle
    handleX(g, dx0+0.25, dx1-0.25, nFace+0.02, FL+1.45, M);
  }

  // ── four-burner hob ──
  // Glass panel on counter
  const hx0 = fx(760), hx1 = fx(855);
  const hz0 = nz0+0.15, hz1 = nz1-0.1;
  box(g, hx0, hx1, hz0, hz1, FL+3.1, FL+3.18, M.blackGlass, {ns:1});
  // stainless trim frame around glass
  box(g, hx0-0.03, hx1+0.03, hz0-0.03, hz1+0.03, FL+3.09, FL+3.12, M.steelBrush, {ns:1});
  // four burner rings (cast iron grates as dark cylinders)
  const burnerCx = [hx0+(hx1-hx0)*0.25, hx0+(hx1-hx0)*0.75];
  const burnerCz = [hz0+(hz1-hz0)*0.28, hz0+(hz1-hz0)*0.72];
  for (const bx of burnerCx) {
    for (const bz of burnerCz) {
      cyl(g, bx, FL+3.18, bz, 0.22, 0.06, M.dark, 16);      // outer grate ring
      cyl(g, bx, FL+3.18, bz, 0.10, 0.07, M.steelBrush, 16); // inner ring (steel)
      cyl(g, bx, FL+3.18, bz, 0.04, 0.09, M.dark, 12);       // centre cap
    }
  }
  // control knobs row (4 small cylinders on front edge of hob)
  const knobZ = nz1 - 0.12;
  const knobXs = [hx0+0.12, hx0+(hx1-hx0)*0.36, hx0+(hx1-hx0)*0.64, hx1-0.12];
  for (const kx of knobXs) {
    cyl(g, kx, FL+3.12, knobZ, 0.055, 0.09, M.steelBrush, 12);
    cyl(g, kx, FL+3.20, knobZ, 0.03, 0.04, M.dark, 12);
  }

  // ── sink ──
  const skx0 = fx(888), skx1 = fx(960);
  const skz0 = nz0+0.18, skz1 = nz1-0.12;
  // outer rim (stainless)
  box(g, skx0, skx1, skz0, skz1, FL+3.00, FL+3.1, M.steelBrush, {ns:1});
  // basin recess (darker inset)
  box(g, skx0+0.06, skx1-0.06, skz0+0.06, skz1-0.06, FL+2.82, FL+3.01, M.dark, {ns:1});
  // mixer tap body
  const tapX = (skx0+skx1)/2;
  cyl(g, tapX, FL+3.1, skz0+0.12, 0.04, 0.55, M.chrome, 12);
  box(g, tapX-0.015, tapX+0.015, skz0+0.06, skz0+0.22, FL+3.65, FL+3.68, M.chrome, {ns:1}); // spout
  box(g, tapX-0.22, tapX+0.22, skz0+0.06, skz0+0.10, FL+3.60, FL+3.62, M.chrome, {ns:1});   // spout arm

  // ── overhead uppers north ── (full width, white doors)
  box(g, fx(660), fx(976), nz0, nz0+0.5, FL+5.2, FL+7.6, M.ceramicWhite);
  // shadow gap at bottom
  box(g, fx(660)+0.02, fx(976)-0.02, nz0, nz0+0.5, FL+5.2, FL+5.22, M.dark, {ns:1});
  // 4 equal upper door panels with handles
  const uw = (fx(976) - fx(660)) / 4;
  for (let i = 0; i < 4; i++) {
    const ux0 = fx(660)+i*uw, ux1 = fx(660)+(i+1)*uw;
    box(g, ux1-0.01, ux1+0.01, nz0, nz0+0.5, FL+5.22, FL+7.58, M.dark, {ns:1}); // gap
    handleX(g, ux0+0.2, ux1-0.2, nz0+0.52, FL+6.3, M);
  }

  // ── chimney ──
  const chx0 = fx(775), chx1 = fx(840);
  // main hood body
  box(g, chx0, chx1, nz0, nz0+0.32, FL+5.5, FL+8.5, M.steelBrush);
  // wider hood canopy at bottom
  box(g, chx0-0.12, chx1+0.12, nz0-0.02, nz0+0.38, FL+5.5, FL+5.72, M.steelBrush);
  // grease filter grille lines
  const gStep = (chx1-chx0)/6;
  for (let i = 1; i < 6; i++) {
    box(g, chx0+i*gStep-0.01, chx0+i*gStep+0.01, nz0+0.01, nz0+0.30, FL+5.52, FL+5.70, M.dark, {ns:1});
  }
  // indicator light strip
  box(g, chx0+0.05, chx1-0.05, nz0-0.01, nz0+0.04, FL+5.56, FL+5.60, M.light, {ns:1});

  // ════════════════════════════════════════════════════════════════
  // EAST WALL  (counter faces west)
  // ════════════════════════════════════════════════════════════════
  const ex0 = fx(976) - cd;
  const eFace = ex0; // west-facing face X

  // ── fridge (NE corner) ──
  const frz0 = nz0, frz1 = nz0+cd;
  // body
  box(g, ex0, fx(976), frz0, frz1, FL, FL+6.2, M.steelBrush);
  // door seam (horizontal at 2/3 height — fridge/freezer split)
  box(g, eFace-0.02, eFace, frz0+0.02, frz1-0.02, FL+4.1, FL+4.14, M.dark, {ns:1});
  // top freezer door handle
  handleZ(g, frz0+0.15, frz1-0.15, eFace-0.05, FL+5.0, M);
  // bottom fridge door handle
  handleZ(g, frz0+0.15, frz1-0.15, eFace-0.05, FL+2.0, M);
  // brand bar (thin accent strip)
  box(g, eFace-0.015, eFace, frz0+0.04, frz1-0.04, FL+4.2, FL+4.5, M.dark, {ns:1});
  // vent grille at top
  const vgStep = (frz1-frz0-0.1)/5;
  for (let i = 0; i < 5; i++) {
    box(g, eFace-0.03, eFace, frz0+0.05+i*vgStep, frz0+0.05+i*vgStep+vgStep*0.55, FL+6.0, FL+6.18, M.dark, {ns:1});
  }

  // ── east base cabinets (south of fridge) ──
  box(g, ex0, fx(976), frz1, fz(1170), FL, FL+2.95, M.wood_oak);
  box(g, ex0, fx(976), frz1, fz(1170), FL+2.95, FL+3.1, M.graniteDk, {ns:1});
  // door gaps + handles for east base (4 doors)
  const eLen = fz(1170) - frz1;
  const eDoor = eLen / 4;
  for (let i = 0; i < 4; i++) {
    const dz0 = frz1 + i*eDoor, dz1 = frz1 + (i+1)*eDoor;
    box(g, eFace-0.02, eFace, dz1-0.01, dz1+0.01, FL+0.05, FL+2.9, M.dark, {ns:1}); // gap
    box(g, eFace-0.02, eFace, dz0+0.02, dz1-0.02, FL+0.05, FL+0.07, M.dark, {ns:1});
    box(g, eFace-0.02, eFace, dz0+0.02, dz1-0.02, FL+2.88, FL+2.9,  M.dark, {ns:1});
    handleZ(g, dz0+0.2, dz1-0.2, eFace-0.05, FL+1.45, M);
  }

  // ── dishwasher (2ft wide, just south of fridge) ──
  const dwz0 = frz1, dwz1 = frz1+2;
  // face panel
  box(g, eFace-0.07, eFace, dwz0, dwz1, FL, FL+2.95, M.steelBrush);
  // control strip at top
  box(g, eFace-0.08, eFace-0.01, dwz0+0.05, dwz1-0.05, FL+2.6, FL+2.92, M.dark, {ns:1});
  // 3 indicator dots on strip
  const dotSpacing = (dwz1-dwz0-0.2)/3;
  for (let i = 0; i < 3; i++) {
    cyl(g, eFace-0.04, FL+2.76, dwz0+0.1+i*dotSpacing+dotSpacing/2, 0.02, 0.015, M.light, 8);
  }
  // door handle
  handleZ(g, dwz0+0.2, dwz1-0.2, eFace-0.09, FL+2.4, M);
  // bottom kick plate
  box(g, eFace-0.07, eFace, dwz0, dwz1, FL, FL+0.2, M.dark, {ns:1});

  // ── east overhead uppers ──
  box(g, fx(976)-0.5, fx(976), fz(880), fz(1160), FL+5.2, FL+7.6, M.ceramicWhite);
  box(g, fx(976)-0.5, fx(976), fz(880), fz(1160), FL+5.2, FL+5.22, M.dark, {ns:1}); // shadow
  // 3 upper doors with handles
  const euLen = fz(1160) - fz(880);
  const euDoor = euLen / 3;
  for (let i = 0; i < 3; i++) {
    const uz0 = fz(880)+i*euDoor, uz1 = fz(880)+(i+1)*euDoor;
    box(g, fx(976)-0.5, fx(976), uz1-0.01, uz1+0.01, FL+5.22, FL+7.58, M.dark, {ns:1});
    handleZ(g, uz0+0.2, uz1-0.2, fx(976)-0.52, FL+6.3, M);
  }

  // ════════════════════════════════════════════════════════════════
  // SOUTH WALL  (counter faces north)
  // ════════════════════════════════════════════════════════════════
  const sz0 = fz(1170) - cd;
  const sFace = sz0; // north-facing face Z

  // ── base counter slab ──
  box(g, fx(660), fx(976), sz0, fz(1170), FL, FL+2.95, M.wood_oak);
  box(g, fx(660), fx(976), sz0, fz(1170), FL+2.95, FL+3.1, M.granite, {ns:1});

  // ── tall cutlery / pantry unit (leftmost 1.5ft) ──
  const cu_x0 = fx(660), cu_x1 = fx(660)+1.5;
  box(g, cu_x0, cu_x1, sz0, fz(1170), FL, FL+7.0, M.wood_oak);
  // 4 shelf lines visible on face
  for (let s = 1; s < 5; s++) {
    box(g, cu_x0, cu_x1, sFace-0.02, sFace, FL+s*1.2, FL+s*1.2+0.04, M.dark, {ns:1});
  }
  // two door panels (upper/lower split at FL+3.5)
  box(g, cu_x0, cu_x1, sFace-0.02, sFace, FL+3.48, FL+3.52, M.dark, {ns:1});
  handleX(g, cu_x0+0.1, cu_x1-0.1, sFace-0.03, FL+2.0, M);
  handleX(g, cu_x0+0.1, cu_x1-0.1, sFace-0.03, FL+5.0, M);

  // ── modular base cabinets between tall units ──
  // segment 1: cx1+0 to cx1+3.5 (before tower 2)
  const seg1x0 = cu_x1, seg1x1 = fx(660)+3.5;
  box(g, seg1x0, seg1x1, sz0, fz(1170), FL, FL+2.95, M.wood_oak);
  box(g, seg1x0, seg1x1, sz0, fz(1170), FL+2.95, FL+3.1, M.granite, {ns:1});
  // 2 doors
  const s1mid = (seg1x0+seg1x1)/2;
  box(g, s1mid-0.01, s1mid+0.01, sFace-0.02, sFace, FL+0.05, FL+2.9, M.dark, {ns:1});
  handleX(g, seg1x0+0.15, s1mid-0.08, sFace-0.03, FL+1.45, M);
  handleX(g, s1mid+0.08, seg1x1-0.15, sFace-0.03, FL+1.45, M);

  // ── tall storage tower 2 (oven unit) ──
  const t2x0 = fx(660)+3.5, t2x1 = fx(660)+5.0;
  box(g, t2x0, t2x1, sz0, fz(1170), FL, FL+7.0, M.wood_oak);
  // oven cavity (middle of tower)
  box(g, t2x0+0.03, t2x1-0.03, sFace-0.02, sFace, FL+1.5, FL+3.3, M.dark, {ns:1}); // door face (dark glass)
  box(g, t2x0+0.06, t2x1-0.06, sFace-0.015, sFace, FL+1.6, FL+3.2, M.blackGlass, {ns:1}); // glass window
  handleX(g, t2x0+0.15, t2x1-0.15, sFace-0.03, FL+3.28, M); // oven door handle
  // oven control strip above door
  box(g, t2x0+0.03, t2x1-0.03, sFace-0.02, sFace, FL+3.32, FL+3.55, M.dark, {ns:1});
  cyl(g, t2x0+(t2x1-t2x0)*0.35, FL+3.44, sFace-0.01, 0.04, 0.02, M.steelBrush, 10);
  cyl(g, t2x0+(t2x1-t2x0)*0.65, FL+3.44, sFace-0.01, 0.04, 0.02, M.steelBrush, 10);
  // upper cabinet doors (above oven)
  box(g, t2x0+0.03, t2x1-0.03, sFace-0.02, sFace, FL+3.56, FL+3.58, M.dark, {ns:1}); // gap
  box(g, t2x0+0.03, t2x1-0.03, sFace-0.02, sFace, FL+3.58, FL+7.0, M.wood_oak);
  handleX(g, t2x0+0.15, t2x1-0.15, sFace-0.03, FL+5.2, M);
  // drawer below oven
  box(g, t2x0+0.03, t2x1-0.03, sFace-0.02, sFace, FL+0.5, FL+1.48, M.wood_oak);
  box(g, t2x0+0.03, t2x1-0.03, sFace-0.02, sFace, FL+1.46, FL+1.5, M.dark, {ns:1});
  handleX(g, t2x0+0.2, t2x1-0.2, sFace-0.03, FL+0.9, M);

  // ── modular base between tower 2 and tower 3 ──
  const seg2x0 = t2x1, seg2x1 = fx(660)+7.0;
  box(g, seg2x0, seg2x1, sz0, fz(1170), FL, FL+2.95, M.wood_oak);
  box(g, seg2x0, seg2x1, sz0, fz(1170), FL+2.95, FL+3.1, M.granite, {ns:1});
  const s2mid = (seg2x0+seg2x1)/2;
  box(g, s2mid-0.01, s2mid+0.01, sFace-0.02, sFace, FL+0.05, FL+2.9, M.dark, {ns:1});
  handleX(g, seg2x0+0.15, s2mid-0.08, sFace-0.03, FL+1.45, M);
  handleX(g, s2mid+0.08, seg2x1-0.15, sFace-0.03, FL+1.45, M);

  // ── tall storage tower 3 (warmer / microwave unit) ──
  const t3x0 = fx(660)+7.0, t3x1 = fx(660)+8.5;
  box(g, t3x0, t3x1, sz0, fz(1170), FL, FL+7.0, M.wood_oak);
  // microwave cavity (upper portion of tower)
  box(g, t3x0+0.03, t3x1-0.03, sFace-0.02, sFace, FL+3.7, FL+5.1, M.dark, {ns:1}); // face
  box(g, t3x0+0.08, t3x1-0.25, sFace-0.015, sFace, FL+3.8, FL+5.0, M.blackGlass, {ns:1}); // door glass
  // microwave control panel strip on right
  box(g, t3x1-0.25, t3x1-0.04, sFace-0.02, sFace, FL+3.8, FL+5.0, M.dark, {ns:1});
  for (let i = 0; i < 4; i++) {
    cyl(g, t3x1-0.18, FL+3.92+i*0.27, sFace-0.01, 0.025, 0.015, M.steelBrush, 8);
  }
  handleX(g, t3x0+0.15, t3x1-0.27, sFace-0.03, FL+5.08, M);
  // door below microwave
  box(g, t3x0+0.03, t3x1-0.03, sFace-0.02, sFace, FL+3.58, FL+3.68, M.dark, {ns:1}); // gap
  box(g, t3x0+0.03, t3x1-0.03, sFace-0.02, sFace, FL+0.5, FL+3.56, M.wood_oak);
  handleX(g, t3x0+0.15, t3x1-0.15, sFace-0.03, FL+2.0, M);
  // shelf above microwave
  box(g, t3x0+0.03, t3x1-0.03, sFace-0.02, sFace, FL+5.12, FL+7.0, M.wood_oak);
  handleX(g, t3x0+0.15, t3x1-0.15, sFace-0.03, FL+5.8, M);

  // ── last base segment (tower 3 to east wall) ──
  const seg3x0 = t3x1, seg3x1 = fx(976);
  if (seg3x1 - seg3x0 > 0.3) {
    box(g, seg3x0, seg3x1, sz0, fz(1170), FL, FL+2.95, M.wood_oak);
    box(g, seg3x0, seg3x1, sz0, fz(1170), FL+2.95, FL+3.1, M.granite, {ns:1});
    handleX(g, seg3x0+0.12, seg3x1-0.12, sFace-0.03, FL+1.45, M);
  }

  // ── overhead uppers south ──
  box(g, fx(660), fx(976), fz(1170)-0.5, fz(1170), FL+5.2, FL+7.6, M.ceramicWhite);
  box(g, fx(660)+0.02, fx(976)-0.02, fz(1170)-0.5, fz(1170), FL+5.2, FL+5.22, M.dark, {ns:1});
  // 4 upper doors with handles
  const suW = (fx(976)-fx(660))/4;
  for (let i = 0; i < 4; i++) {
    const ux0 = fx(660)+i*suW, ux1 = fx(660)+(i+1)*suW;
    box(g, ux1-0.01, ux1+0.01, fz(1170)-0.5, fz(1170), FL+5.22, FL+7.58, M.dark, {ns:1});
    handleX(g, ux0+0.2, ux1-0.2, fz(1170)-0.52, FL+6.3, M);
  }

  // ════════════════════════════════════════════════════════════════
  // COLLISION BOXES
  // ════════════════════════════════════════════════════════════════
  addFurnSOL(wx0, wx1, wz0, wz1);               // west arm
  addFurnSOL(fx(657), fx(976), nz0, nz1);        // north counter
  addFurnSOL(ex0, fx(976), nz0, fz(1170));       // east counter + fridge
  addFurnSOL(fx(660), fx(976), sz0, fz(1170));   // south counter
}

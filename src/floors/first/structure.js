import { fx, fz, FL1, H, TH } from '../../core/coords.js';
import { pb, sb, disposeGroup } from '../../core/geometry.js';
import { wall, doorLeaf, doorArc } from '../../core/joinery.js';

export function buildStructure(g, M, appState) {
  disposeGroup(g);
  g.clear();
  appState.SOL.length = 0;
  appState.CAP = (appState.st.cut && appState.st.mode !== 'walk') ? FL1 + 3.5 : 1e9;
  const showRoof = (appState.st.roof || appState.st.mode === 'walk') && appState.CAP > 1e8;

  // floor slab (ceiling of G floor / floor of F floor)
  // Full footprint in 3 sections to leave the open-below void (px 222–660, pz 1320–1513)
  pb(g, 222, 735,  985, 1320, FL1-0.6, FL1, M.slab, {ns:1}); // north half
  pb(g, 660, 1320, 985, 1513, FL1-0.6, FL1, M.slab, {ns:1}); // east of open-below
  pb(g, 222, 1513, 985, 1985, FL1-0.6, FL1, M.slab, {ns:1}); // south half

  // floor finish tiles (thin layer on top of slab, room by room)
  const fl = (r, m) => pb(g, r[0], r[1], r[2], r[3], FL1, FL1+0.05, m, {ns:1});
  fl([222, 735, 985, 1170], M.floor);   // master bedroom + top balcony + ensuite + wardrobe zone
  fl([222,1170, 523,1513], M.floorP);   // study
  fl([660,1170, 985,1513], M.floor);    // stair/lift zone
  fl([222,1513, 985,1985], M.floor);    // south half — bedroom 2, dresser, toilet, south balcony

  // ── outer walls ──
  const Y = FL1;

  // North outer wall (horiz, pz=735)
  // Blue annotation "4×6 W" — 4' wide × 6' tall custom window on balcony's north wall
  wall(g, false, 735, 222, 985, [
    {a:285, b:403, s:2, e:8, k:'win', label:"W 4'×6'"},  // balcony north window (blue annotation)
  ], M, Y);

  // East outer wall (vert, px=976)
  wall(g, true, 976, 735, 1985, [
    {a:790,  b:849,  s:7.5, e:9.5, k:'v1',  label:"V1 2'×2'"},
    {a:985,  b:1044, s:3,   e:7,   k:'win', label:"W1 2'×4'"},
    {a:1280, b:1339, s:3,   e:7,   k:'win', label:"W1 2'×4'"},
    {a:1420, b:1479, s:3,   e:7,   k:'win', label:"W1 2'×4'"},
    {a:1700, b:1759, s:3,   e:7,   k:'win', label:"W1 2'×4'"},
  ], M, Y);

  // West outer wall (vert, px=222)
  // W5 (3'×4') in master bedroom zone (row A–B), W (4'×4') in study zone (row B–C)
  // Blue annotation "W3 W1" in south balcony zone (row C–E)
  wall(g, true, 222, 735, 1985, [
    {a:900,  b:988,  s:3, e:7, k:'win', label:"W5 3'×4'"},  // master bedroom west
    {a:1200, b:1318, s:3, e:7, k:'win', label:"W 4'×4'"},   // study west
    {a:1643, b:1702, s:0, e:8, k:'win', label:"W3 2'×8'"},  // south balcony (blue)
    {a:1870, b:1929, s:3, e:7, k:'win', label:"W1 2'×4'"},  // south balcony (blue)
  ], M, Y);

  // South outer wall (horiz, pz=1985)
  wall(g, false, 1985, 222, 985, [
    {a:531, b:590, s:7.5, e:9.5, k:'v1',  label:"V1 2'×2'"},
    {a:696, b:907, s:1.5, e:6.5, k:'win', label:"W6 7'×5'"},
  ], M, Y);

  // ── interior walls ──

  // Row B wall — master bedroom / study divider (horiz, pz=1170)
  wall(g, false, 1170, 222, 985, [
    {a:488, b:562, s:0, e:7, k:'door', label:"D1"},  // study to corridor  (2'6" = 74px)
    {a:572, b:660, s:0, e:7, k:'door', label:"D"},   // master to corridor (3'0" = 89px)
  ], M, Y);

  // Col 3 wall — master / ensuite+wardrobe (vert, px=660, pz 735–1170)
  wall(g, true, 660, 735, 1170, [
    {a:750, b:824, s:0, e:7, k:'door', label:"D1"},  // ensuite entrance (2'6" = 74px)
  ], M, Y);

  // Balcony east wall (vert, px=481, pz 735–1170) — separates top balcony from master
  wall(g, true, 481, 735, 1170, [
    {a:762, b:938, s:0, e:7, k:'sd', label:"SD 6'×7'"},  // balcony sliding door
  ], M, Y);

  // Ensuite/wardrobe divide (horiz, pz=910, px 660–985)
  wall(g, false, 910, 660, 985, [], M, Y);

  // Study east wall (vert, px=523, pz 1170–1320)
  wall(g, true, 523, 1170, 1320, [], M, Y);

  // Study south wall (horiz, pz=1320, px 222–523)
  wall(g, false, 1320, 222, 523, [], M, Y);

  // Open-below balustrade (low parapet around the void — visual only, no SOL push)
  // Thin railing on the interior edge of the void at pz=1320 (west side) and px=523 (east side)
  pb(g, 222, 1320, 525, 1323, FL1, FL1+3.0, M.col, {ns:1}); // south edge of study
  pb(g, 523, 1320, 526, 1513, FL1, FL1+3.0, M.col, {ns:1}); // east edge of open-below
  pb(g, 222, 1510, 525, 1513, FL1, FL1+3.0, M.col, {ns:1}); // north edge of south half

  // South half — row D wall (horiz, pz=1513, px 481–985)
  wall(g, false, 1513, 481, 985, [
    {a:575, b:665, s:0, e:7, k:'door', label:"D 3'×7'"},  // bedroom 2 entrance
  ], M, Y);

  // South balcony east wall (vert, px=481, pz 1513–1985)
  wall(g, true, 481, 1513, 1985, [
    {a:1760, b:1936, s:0, e:7, k:'sd', label:"SD 6'×7'"},  // south balcony sliding door
  ], M, Y);

  // Dresser south wall / toilet north wall (horiz, pz=1640, px 481–660)
  wall(g, false, 1640, 481, 660, [
    {a:528, b:602, s:0, e:7, k:'door', label:"D1"},  // toilet entrance (2'6" = 74px)
  ], M, Y);

  // Bed2 west wall / dresser+toilet east wall (vert, px=660, pz 1513–1985)
  wall(g, true, 660, 1513, 1985, [], M, Y);

  // ── door leaves + arcs ──
  // Study door (horiz wall pz=1170, hinge at px=488, opens south)
  doorLeaf(g, 488, 1170, 0, 1, 2.5, M, Y);
  doorArc(g, 488, 1170, 2.5, [0,1], 1, Y);
  // Master bedroom door (horiz wall pz=1170, hinge at px=660, opens south)
  doorLeaf(g, 660, 1170, -1, 0, 3.0, M, Y);
  doorArc(g, 660, 1170, 3.0, [-1,0], 1, Y);
  // Ensuite door (vert wall px=660, hinge at pz=824, opens west into bedroom)
  doorLeaf(g, 660, 824, -1, 0, 2.5, M, Y);
  doorArc(g, 660, 824, 2.5, [-1,0], 1, Y);
  // Bed2 entrance (horiz wall pz=1513, hinge at px=665, opens south)
  doorLeaf(g, 665, 1513, 0, 1, 3.0, M, Y);
  doorArc(g, 665, 1513, 3.0, [0,1], 1, Y);
  // Toilet door (horiz wall pz=1640, hinge at px=602, opens north into dresser)
  doorLeaf(g, 602, 1640, 0, -1, 2.5, M, Y);
  doorArc(g, 602, 1640, 2.5, [0,-1], 1, Y);

  // ── lift shaft continuation ──
  // Shaft walls continue from G floor — just add the cap walls above the stair opening
  sb(g, 722, 1275, 865, 1290, FL1, FL1+H, M.lift);
  sb(g, 722, 1423, 865, 1440, FL1, FL1+H, M.lift);
  sb(g, 722, 1290, 737, 1320, FL1, FL1+H, M.lift);
  sb(g, 722, 1390, 737, 1423, FL1, FL1+H, M.lift);
  sb(g, 855, 1290, 865, 1423, FL1, FL1+H, M.lift);
  sb(g, 722, 1320, 737, 1390, FL1+7, FL1+H, M.lift);
  sb(g, 724, 1322, 729, 1388, FL1, FL1+7, M.steel);
  appState.SOL.push([fx(722), fx(865), fz(1275), fz(1440)]);

  // ── roof slab ──
  if (showRoof) {
    [[222,735,660,1170],[660,735,985,1985],[222,1170,660,1513],[222,1513,660,1985]].forEach(r => {
      const m = pb(g, r[0]-6, r[1]-6, r[2]+6, r[3]+6, FL1+H, FL1+H+0.6, M.slab, {});
      if (m) m.castShadow = false;
    });
  }
}

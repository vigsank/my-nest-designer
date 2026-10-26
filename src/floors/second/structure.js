import { fx, fz, FL2, H, TH } from '../../core/coords.js';
import { pb, sb, disposeGroup } from '../../core/geometry.js';
import { wall, doorLeaf, doorArc } from '../../core/joinery.js';

export function buildStructure(g, M, appState) {
  disposeGroup(g);
  g.clear();
  appState.SOL.length = 0;
  appState.CAP = (appState.st.cut && appState.st.mode !== 'walk') ? FL2 + 3.5 : 1e9;
  const showRoof = (appState.st.roof || appState.st.mode === 'walk') && appState.CAP > 1e8;

  // floor slab (ceiling of F floor / floor of S floor)
  // Leave open-below void: px 156–481, pz 1320–1513
  pb(g, 156,  648, 985, 1320, FL2-0.6, FL2, M.slab, {ns:1}); // north half (full width)
  pb(g, 481, 1320, 985, 1513, FL2-0.6, FL2, M.slab, {ns:1}); // east of void
  pb(g, 156, 1513, 985, 1985, FL2-0.6, FL2, M.slab, {ns:1}); // south half (full width)

  // floor finish tiles
  const fl = (r, m) => pb(g, r[0], r[1], r[2], r[3], FL2, FL2+0.05, m, {ns:1});
  fl([156,  648, 660, 1170], M.floor);   // home theatre
  fl([660,  648, 985, 1170], M.floor);   // office + store zone
  fl([156, 1170, 481, 1320], M.floorW);  // toilet
  fl([660, 1170, 985, 1513], M.floor);   // stair/lift zone
  fl([156, 1513, 985, 1985], M.porch);   // open terrace + wash area

  const Y = FL2;

  // ── outer walls ──

  // North outer wall (horiz, pz=648)
  wall(g, false, 648, 156, 985, [
    {a:210, b:328, s:3, e:7, k:'win', label:"W 4'×4'"},   // home theatre north
    {a:696, b:814, s:3, e:7, k:'win', label:"W 4'×4'"},   // office/store north
  ], M, Y);

  // East outer wall (vert, px=985)
  wall(g, true, 985, 648, 1985, [
    {a:720,  b:838,  s:3,   e:7,   k:'win', label:"W 4'×4'"},   // office east
    {a:1270, b:1329, s:3,   e:7,   k:'win', label:"W1 2'×4'"},  // stair zone upper
    {a:1420, b:1479, s:3,   e:7,   k:'win', label:"W1 2'×4'"},  // stair zone lower
  ], M, Y);

  // West outer wall (vert, px=156)
  wall(g, true, 156, 648, 1985, [
    {a:735,  b:853,  s:3,   e:7,   k:'win', label:"W 4'×4'"},   // home theatre west
    {a:1205, b:1264, s:7.5, e:9.5, k:'v1',  label:"V1 2'×2'"},  // toilet vent
  ], M, Y);

  // South outer wall (horiz, pz=1985)
  wall(g, false, 1985, 156, 985, [
    {a:545, b:663, s:3, e:7, k:'win', label:"W 4'×4'"},  // terrace/wash area south
  ], M, Y);

  // ── interior walls ──

  // Col-3 wall full height (vert, px=660, pz 648–1513)
  // Office entry D1 at top, store entry D1 below row-B-mid wall (pz=910)
  wall(g, true, 660, 648, 1513, [
    {a:648, b:722, s:0, e:7, k:'door', label:"D1 2'6\"×7'"},  // office entry (hinge at pz=648)
    {a:910, b:984, s:0, e:7, k:'door', label:"D1 2'6\"×7'"},  // store entry
  ], M, Y);

  // Office/Store divider (horiz, pz=910, px 660–985)
  wall(g, false, 910, 660, 985, [], M, Y);

  // Row-B wall (horiz, pz=1170, px 156–660)
  // Home Theatre D opens south into corridor; Toilet D1 opens south
  wall(g, false, 1170, 156, 660, [
    {a:264, b:338, s:0, e:7, k:'door', label:"D1 2'6\"×7'"},  // toilet entry
    {a:368, b:457, s:0, e:7, k:'door', label:"D 3'×7'"},      // home theatre corridor
  ], M, Y);

  // Toilet east wall (vert, px=481, pz 1170–1320)
  wall(g, true, 481, 1170, 1320, [], M, Y);

  // Toilet south wall / open-below north parapet (horiz, pz=1320, px 156–481)
  wall(g, false, 1320, 156, 481, [], M, Y);

  // Open-below void balustrade (low railing around void)
  pb(g, 156, 1320, 483, 1323, FL2, FL2+3.0, M.col, {ns:1}); // top edge (east of void)
  pb(g, 479, 1320, 483, 1513, FL2, FL2+3.0, M.col, {ns:1}); // east edge of void
  pb(g, 156, 1510, 483, 1513, FL2, FL2+3.0, M.col, {ns:1}); // bottom edge

  // Row-D wall (horiz, pz=1513, px 481–985) — terrace/wash area divide east half
  wall(g, false, 1513, 481, 985, [], M, Y);

  // Terrace/Wash sliding door wall section (horiz, pz=1513, px 156–481)
  // SD opens from home theatre zone onto terrace
  wall(g, false, 1513, 156, 481, [
    {a:232, b:409, s:0, e:7, k:'sd', label:"SD 6'×7'"},  // terrace sliding door
  ], M, Y);

  // Wash area west wall (vert, px=660, pz 1513–1985) — separates terrace from wash area
  wall(g, true, 660, 1513, 1985, [], M, Y);

  // ── door leaves + arcs ──
  // Office D1: col-3 wall (px=660), hinge pz=648, opens east into office
  doorLeaf(g, 660, 648, 1, 0, 2.5, M, Y);
  doorArc(g, 660, 648, 2.5, [1,0], 1, Y);
  // Store D1: col-3 wall (px=660), hinge pz=984, opens east into store
  doorLeaf(g, 660, 984, 1, 0, 2.5, M, Y);
  doorArc(g, 660, 984, 2.5, [1,0], 1, Y);
  // Toilet D1: row-B wall (pz=1170), hinge at px=338, opens south into toilet
  doorLeaf(g, 338, 1170, 0, 1, 2.5, M, Y);
  doorArc(g, 338, 1170, 2.5, [0,1], 1, Y);
  // Home Theatre D: row-B wall (pz=1170), hinge at px=368, opens north into theatre
  doorLeaf(g, 368, 1170, 0, -1, 3.0, M, Y);
  doorArc(g, 368, 1170, 3.0, [0,-1], 1, Y);

  // ── lift shaft continuation ──
  sb(g, 722, 1275, 865, 1290, FL2, FL2+H, M.lift);
  sb(g, 722, 1423, 865, 1440, FL2, FL2+H, M.lift);
  sb(g, 722, 1290, 737, 1320, FL2, FL2+H, M.lift);
  sb(g, 722, 1390, 737, 1423, FL2, FL2+H, M.lift);
  sb(g, 855, 1290, 865, 1423, FL2, FL2+H, M.lift);
  sb(g, 722, 1320, 737, 1390, FL2+7, FL2+H, M.lift);
  sb(g, 724, 1322, 729, 1388, FL2, FL2+7, M.steel);
  appState.SOL.push([fx(722), fx(865), fz(1275), fz(1440)]);

  // ── roof slab ──
  if (showRoof) {
    // Cover roofed portions: home theatre, office/store, toilet, stair, wash area
    // Terrace is open — no roof
    [
      [156, 648, 660, 1170],  // home theatre
      [660, 648, 985, 1170],  // office + store
      [156, 1170, 481, 1320], // toilet
      [660, 1170, 985, 1985], // stair + lift + wash area
    ].forEach(r => {
      const m = pb(g, r[0]-6, r[1]-6, r[2]+6, r[3]+6, FL2+H, FL2+H+0.6, M.slab, {});
      if (m) m.castShadow = false;
    });
  }
}

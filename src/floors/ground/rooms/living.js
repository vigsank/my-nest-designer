import { fx, fz, FL, S } from '../../../core/coords.js';
import { box, pb } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  const sW = FP.sofaW / 2, sD = FP.sofaD;

  // Sofa: back on east side, faces west toward TV wall
  const sx = fx(580) - sD / 2;   // west edge of sofa
  const sz = fz(1340);            // centre Z

  // sofa seat + back + arms
  box(g, sx, sx+sD,       sz-sW, sz+sW, FL,      FL+1.5,  M.fabric);
  box(g, sx+sD-0.3, sx+sD, sz-sW, sz+sW, FL+1.5,  FL+3.0,  M.fabric);  // back rest
  box(g, sx, sx+0.3,       sz-sW, sz+sW, FL+1.5,  FL+2.2,  M.fabric);  // front arm low
  box(g, sx+sD-0.3, sx+sD, sz-sW-0.3, sz-sW+0.3, FL, FL+2.2, M.fabric); // arm L
  box(g, sx+sD-0.3, sx+sD, sz+sW-0.3, sz+sW+0.3, FL, FL+2.2, M.fabric); // arm R
  addFurnSOL(sx, sx+sD, sz-sW, sz+sW);

  // rug (extends west toward TV wall and north/south of sofa)
  box(g, sx-3.5, sx+sD+0.3, sz-sW-0.5, sz+sW+0.5, FL+0.05, FL+0.1, M.rug, {ns:1});

  // coffee table: in front (west) of sofa, between sofa and TV
  const ct_x1 = sx - 0.5;
  const ct_x0 = ct_x1 - 2.5;
  box(g, ct_x0, ct_x1, sz-0.75, sz+0.75, FL+0.1,  FL+1.4,  M.woodD);   // legs/body
  box(g, ct_x0, ct_x1, sz-0.75, sz+0.75, FL+1.4,  FL+1.52, M.wood);    // glass top

  // ── Wall-mounted 65" TV on west wall ──
  const tvWall = fx(285);
  // 65-inch: 57" wide = 4.78ft, 33" tall = 2.77ft; mount centre at eye height ~5ft
  const tvW = 4.78, tvH = 2.77;
  const tvZ0 = sz - tvW/2, tvZ1 = sz + tvW/2;
  const tvY0 = FL + 3.6, tvY1 = tvY0 + tvH;   // bottom at 5.1ft, top at 7.9ft
  // slim wall-mount bracket bar (steel, tight to wall)
  box(g, tvWall, tvWall+0.06, sz-0.5, sz+0.5, tvY0+tvH/2-0.05, tvY0+tvH/2+0.05, M.steel, {ns:1});
  // bezel (dark frame, 3" border)
  box(g, tvWall+0.03, tvWall+0.13, tvZ0-0.08, tvZ1+0.08, tvY0-0.08, tvY1+0.08, M.dark);
  // screen
  box(g, tvWall+0.05, tvWall+0.12, tvZ0, tvZ1, tvY0, tvY1, M.dark, {ns:1});

  // armchair facing TV (south-west of sofa)
  box(g, fx(250), fx(330), fz(1460), fz(1505), FL,     FL+1.5,  M.fabric);
  box(g, fx(322), fx(330), fz(1460), fz(1505), FL+1.5, FL+2.8,  M.fabric);
}

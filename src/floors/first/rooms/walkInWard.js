import { fx, fz, FL1 } from '../../../core/coords.js';
import { box } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  // Walk-in wardrobe: px 660–976, pz 910–1143
  const x0 = fx(660), x1 = fx(976);
  const z0 = fz(910),  z1 = fz(1143);
  const d = 0.5; // shelf depth

  // Full-wall wardrobes on 3 sides
  box(g, x0+0.15, x1-0.15, z0+0.15, z0+d, FL1, FL1+7.5, M.woodD); // north
  box(g, x0+0.15, x0+d,    z0+d,    z1-0.15, FL1, FL1+7.5, M.woodD); // west
  box(g, x1-d,    x1-0.15, z0+d,    z1-0.15, FL1, FL1+7.5, M.woodD); // east

  addFurnSOL(x0+0.15, x1-0.15, z0+0.15, z0+d);
  addFurnSOL(x0+0.15, x0+d,    z0+d,    z1-0.15);
  addFurnSOL(x1-d,    x1-0.15, z0+d,    z1-0.15);
}

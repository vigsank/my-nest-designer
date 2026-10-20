import { fx, fz, FL } from '../../core/coords.js';
import { box, cyl } from '../../core/geometry.js';

function wc(g, px, py, M, FL) {
  const x = fx(px), z = fz(py);
  box(g, x-0.6, x+0.6, z-0.2, z+0.7, FL, FL+2.5, M.white);
  cyl(g, x, FL, z+0.9, 0.55, 1.3, M.white, 16);
}

export function build(g, M, FP, addFurnSOL) {
  wc(g, 880, 1565, M, FL);
}

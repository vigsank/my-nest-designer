import { fx, fz, FL1 } from '../../../core/coords.js';
import { box } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  // Bed2 toilet: px 481–660, pz 1640–1985
  const x0 = fx(481), x1 = fx(660);
  const z0 = fz(1640), z1 = fz(1985);

  // WC against south wall
  const wcX = (x0+x1)/2;
  box(g, wcX-0.9, wcX+0.9, z1-1.3, z1-0.15, FL1, FL1+1.5, M.white);
  box(g, wcX-0.8, wcX+0.8, z1-1.4, z1-0.6,  FL1+1.5, FL1+1.85, M.white, {ns:1});

  // Basin on east wall
  box(g, x1-1.4, x1-0.15, z0+0.5, z0+1.3, FL1, FL1+3.0, M.cab);
  box(g, x1-1.4, x1-0.15, z0+0.5, z0+1.3, FL1+3.0, FL1+3.1, M.counter, {ns:1});

  // Shower in north-west corner
  box(g, x0+0.15, x0+2.5, z0+0.15, z0+2.5, FL1, FL1+0.1, M.stone, {ns:1});

  addFurnSOL(wcX-0.9, wcX+0.9, z1-1.3, z1-0.15);
  addFurnSOL(x1-1.4,  x1-0.15, z0+0.5, z0+1.3);
}

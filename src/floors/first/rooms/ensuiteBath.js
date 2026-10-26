import { fx, fz, FL1 } from '../../../core/coords.js';
import { box } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  // Ensuite toilet: px 660–976, pz 735–910
  const x0 = fx(660), x1 = fx(976), z0 = fz(735), z1 = fz(910);

  // WC against north wall
  const wcX = (x0+x1)/2 + 1.5;
  box(g, wcX-0.9, wcX+0.9, z0+0.15, z0+1.3, FL1, FL1+1.5, M.white);
  box(g, wcX-0.8, wcX+0.8, z0+0.6,  z0+1.4, FL1+1.5, FL1+1.85, M.white, {ns:1});

  // Basin/vanity on west wall
  box(g, x0+0.15, x0+1.4, z0+0.5, z0+1.5, FL1, FL1+3.0, M.cab);
  box(g, x0+0.15, x0+1.4, z0+0.5, z0+1.5, FL1+3.0, FL1+3.1, M.counter, {ns:1});

  // Shower in east corner
  box(g, x1-2.5, x1-0.15, z0+0.15, z0+2.5, FL1, FL1+0.1, M.stone, {ns:1});

  addFurnSOL(wcX-0.9, wcX+0.9, z0+0.15, z0+1.4);
  addFurnSOL(x0+0.15, x0+1.4,  z0+0.5,  z0+1.5);
}

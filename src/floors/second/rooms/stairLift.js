import { fx, fz, FL2 } from '../../../core/coords.js';
import { pb } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  // Stair/Lift zone: px 660–985, pz 1170–1513
  // Stair treads — 16 risers going up (visual only, no collision)
  const steps = 16;
  for (let i = 0; i < steps; i++) {
    const z0 = 1170 + i * (1513-1170) / steps;
    const z1 = 1170 + (i+1) * (1513-1170) / steps;
    pb(g, 805, z0, 985, z1, FL2 - 10 + i * 10/steps, FL2 - 10 + (i+1) * 10/steps, M.floor);
  }
}

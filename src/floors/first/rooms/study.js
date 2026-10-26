import { fx, fz, FL1 } from '../../../core/coords.js';
import { box } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  // Study: px 222–523, pz 1170–1320
  const x0 = fx(222), x1 = fx(523);
  const z0 = fz(1170), z1 = fz(1320);

  // Desk along east wall
  const deskZ = (z0 + z1) / 2;
  box(g, x1-2.5, x1-0.15, deskZ-0.8, deskZ+0.8, FL1, FL1+2.5, M.woodD);
  box(g, x1-2.5, x1-0.15, deskZ-0.8, deskZ+0.8, FL1+2.5, FL1+2.6, M.wood, {ns:1});

  // Bookshelf on north wall
  box(g, x0+0.5, x0+2.5, z0+0.15, z0+0.5, FL1, FL1+7.5, M.woodD);

  addFurnSOL(x1-2.5, x1-0.15, deskZ-0.8, deskZ+0.8);
  addFurnSOL(x0+0.5, x0+2.5,  z0+0.15,   z0+0.5);
}

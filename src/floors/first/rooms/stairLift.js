import { fx, fz, FL1, H } from '../../../core/coords.js';
import { box, sb } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  // Stair landing and stair going up to terrace
  // Stair zone: px 660–865, pz 1170–1513
  const r = 10/16; // riser height in ft

  // Landing slab (already part of floor slab in structure.js)
  // Stair flight going UP (terrace direction) — same proportions as G floor stair
  const stepA = (865+5-722)/6;
  for (let i = 0; i < 6; i++) {
    const x0 = 722+i*stepA, x1 = x0+stepA, y = FL1+(i+1)*r;
    sb(g, x0, 1178, x1, 1275, y-0.25, y, M.stone);
    sb(g, x0, 1178, x0+3, 1275, y-r, y, M.stone);
  }
  sb(g, 870, 1178, 968, 1275, FL1+7*r-0.3, FL1+7*r, M.stone);

  const stepB = (1525-1275)/9;
  for (let j = 0; j < 9; j++) {
    const y0 = 1275+j*stepB, y1 = y0+stepB, y = FL1+(8+j)*r;
    sb(g, 870, y0, 968, y1, y-0.25, y, M.stone);
    sb(g, 870, y0, 968, y0+3, y-r, y, M.stone);
  }
  // stair glass balustrade
  sb(g, 866, 1290, 869, 1525, FL1+4.4, FL1+7.4, M.glass);
}

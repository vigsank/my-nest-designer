import { fx, fz, FL2 } from '../../../core/coords.js';
import { box } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  // Store: px 660–985, pz 910–1170
  const shelfD = 1.5;

  // Shelving along east wall
  box(g, fx(985)-shelfD, fx(985), fz(930), fz(1150), FL2, FL2+8.0, M.woodD);
  // Shelving along north wall (east half)
  box(g, fx(800), fx(985)-shelfD, fz(920), fz(920)+shelfD, FL2, FL2+8.0, M.woodD);

  addFurnSOL(fx(985)-shelfD, fx(985), fz(930), fz(1150));
  addFurnSOL(fx(800), fx(985)-shelfD, fz(920), fz(920)+shelfD);
}

import { fx, fz, FL2 } from '../../../core/coords.js';
import { box } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  // Office: px 660–985, pz 648–910
  const cx = fx(822), cz = fz(779);

  // Desk along east wall
  const deskW = 4.0, deskD = 2.0;
  box(g, fx(940)-deskD, fx(940), fz(680), fz(680)+deskW, FL2, FL2+2.8, M.woodD);
  // monitor
  box(g, fx(940)-1.5, fx(940)-1.3, fz(680)+1.5, fz(680)+1.8, FL2+2.8, FL2+4.4, M.white, {ns:1});
  // chair (rolling, centred in front of desk)
  box(g, fx(940)-2.8, fx(940)-2.0, fz(680)+1.2, fz(680)+2.0, FL2, FL2+2.8, M.fabricD);

  // Bookshelf on north wall
  box(g, fx(680), fx(860), fz(660), fz(680), FL2, FL2+7.0, M.woodD);

  addFurnSOL(fx(940)-deskD, fx(940), fz(680), fz(680)+deskW);
  addFurnSOL(fx(680), fx(860), fz(660), fz(680));
}

import { fx, fz, FL2 } from '../../../core/coords.js';
import { box } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  // Wash Area: px 660–985, pz 1513–1985 (east side of terrace level)
  // Washing machine against north wall
  box(g, fx(680), fx(740), fz(1535), fz(1600), FL2, FL2+3.8, M.white);
  // Dryer next to it
  box(g, fx(745), fx(805), fz(1535), fz(1600), FL2, FL2+3.8, M.white);

  // Drying rack / counter along east wall
  box(g, fx(940), fx(983), fz(1540), fz(1980), FL2, FL2+3.0, M.woodD);

  addFurnSOL(fx(680), fx(805), fz(1535), fz(1600));
  addFurnSOL(fx(940), fx(983), fz(1540), fz(1980));
}

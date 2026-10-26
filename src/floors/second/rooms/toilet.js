import { fx, fz, FL2 } from '../../../core/coords.js';
import { box } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  // Toilet: px 156–481, pz 1170–1320
  // WC against east wall
  box(g, fx(440), fx(478), fz(1200), fz(1260), FL2, FL2+1.5, M.white);
  box(g, fx(440), fx(478), fz(1188), fz(1210), FL2+1.0, FL2+2.5, M.white);

  // Basin on south wall
  box(g, fx(200), fx(260), fz(1297), fz(1315), FL2, FL2+3.0, M.white);
  box(g, fx(210), fx(250), fz(1297), fz(1310), FL2+2.5, FL2+3.1, M.white, {ns:1});

  addFurnSOL(fx(440), fx(478), fz(1188), fz(1260));
  addFurnSOL(fx(200), fx(260), fz(1297), fz(1315));
}

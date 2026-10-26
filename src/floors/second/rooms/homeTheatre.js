import { fx, fz, FL2 } from '../../../core/coords.js';
import { box } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  // Home Theatre: px 156–660, pz 648–1170
  const cx = fx(408), cz = fz(909);

  // Large projection screen on south wall (pz=1170 interior face)
  const sw = 6.0, sh = 3.4;
  box(g, cx-sw/2, cx+sw/2, fz(1155)-0.1, fz(1155), FL2+3.5, FL2+3.5+sh, M.white, {ns:1});
  // screen bezel
  box(g, cx-sw/2-0.15, cx+sw/2+0.15, fz(1155)-0.12, fz(1155)+0.02, FL2+3.3, FL2+3.3+sh+0.4, M.woodD, {ns:1});

  // Three rows of sofa seating (2 seats per row) facing south wall screen
  const seatW = 1.8, seatD = 0.85, seatH = 1.6;
  for (let row = 0; row < 3; row++) {
    const rowZ = fz(1120) - row * (seatD + 1.2);
    for (let col = 0; col < 2; col++) {
      const seatX = cx - 1.2 + col * (seatW + 0.5);
      // seat base
      box(g, seatX, seatX+seatW, rowZ-seatD, rowZ, FL2, FL2+0.55, M.fabricD);
      // seat back
      box(g, seatX, seatX+seatW, rowZ-0.15, rowZ, FL2, FL2+seatH, M.fabricD);
    }
  }

  // Side table (west wall)
  box(g, fx(175), fx(310), fz(850), fz(1000), FL2, FL2+2.8, M.woodD);

  addFurnSOL(cx-sw/2-0.15, cx+sw/2+0.15, fz(1155)-0.2, fz(1155)+0.05);
}

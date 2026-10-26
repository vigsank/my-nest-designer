import { fx, fz, FL1 } from '../../../core/coords.js';
import { box } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  const bW = FP.bedW, bD = FP.bedD;
  // Bedroom 2: px 660–976, pz 1513–1985
  // Bed centred east-west, headboard against north wall
  const bedCX = fx(818);
  const bedCZ = fz(1513) + bD/2 + 0.5;

  box(g, bedCX-bW/2, bedCX+bW/2, bedCZ-bD/2, bedCZ+bD/2, FL1, FL1+1.0, M.woodD);
  box(g, bedCX-bW/2, bedCX+bW/2, bedCZ-bD/2, bedCZ+bD/2, FL1+1.0, FL1+1.7, M.white);
  box(g, bedCX-bW/2*0.8, bedCX+bW/2*0.8, bedCZ-bD/2, bedCZ+bD/2, FL1+1.7, FL1+1.85, M.fabricD, {ns:1});

  // headboard
  box(g, bedCX-bW/2, bedCX+bW/2, bedCZ-bD/2-0.25, bedCZ-bD/2, FL1, FL1+3.6, M.woodD);

  // pillows
  box(g, bedCX-bW/2+0.1, bedCX-0.1,      bedCZ-bD/2+0.3, bedCZ-bD/2+0.9, FL1+1.7, FL1+2.2, M.cream);
  box(g, bedCX+0.1,       bedCX+bW/2-0.1, bedCZ-bD/2+0.3, bedCZ-bD/2+0.9, FL1+1.7, FL1+2.2, M.cream);

  // side tables
  box(g, bedCX-bW/2-1.6, bedCX-bW/2-0.1, bedCZ-0.7, bedCZ+0.7, FL1, FL1+2.4, M.woodD);
  box(g, bedCX+bW/2+0.1, bedCX+bW/2+1.6, bedCZ-0.7, bedCZ+0.7, FL1, FL1+2.4, M.woodD);

  // wardrobe on west wall
  box(g, fx(660)+0.15, fx(660)+2.0, fz(1700), fz(1900), FL1, FL1+7.5, M.woodD);

  // rug
  box(g, bedCX-bW/2-0.3, bedCX+bW/2+0.3, bedCZ-bD/2-0.3, bedCZ+bD/2+2.5, FL1+0.05, FL1+0.09, M.rug2, {ns:1});

  addFurnSOL(bedCX-bW/2, bedCX+bW/2, bedCZ-bD/2, bedCZ+bD/2+0.3);
  addFurnSOL(fx(660)+0.15, fx(660)+2.0, fz(1700), fz(1900));
}

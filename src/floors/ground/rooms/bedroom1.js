import { fx, fz, FL } from '../../../core/coords.js';
import { box } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  const bW = FP.bedW, bD = FP.bedD;
  const bedCX = fx(818), bedCZ = fz(1978) - bD/2 - 0.3;

  // mattress base + mattress
  box(g, bedCX-bW/2, bedCX+bW/2, bedCZ-bD/2, bedCZ+bD/2, FL, FL+1.0, M.woodD);
  box(g, bedCX-bW/2, bedCX+bW/2, bedCZ-bD/2, bedCZ+bD/2, FL+1.0, FL+1.7, M.white);
  box(g, bedCX-bW/2*0.8, bedCX+bW/2*0.8, bedCZ-bD/2, bedCZ+bD/2, FL+1.7, FL+1.85, M.fabricD, {ns:1});

  // headboard
  box(g, bedCX-bW/2, bedCX+bW/2, bedCZ+bD/2, bedCZ+bD/2+0.25, FL, FL+3.6, M.woodD);

  // pillows
  box(g, bedCX-bW/2+0.1, bedCX-0.1, bedCZ+bD/2-1.0, bedCZ+bD/2-0.4, FL+1.7, FL+2.2, M.cream);
  box(g, bedCX+0.1, bedCX+bW/2-0.1, bedCZ+bD/2-1.0, bedCZ+bD/2-0.4, FL+1.7, FL+2.2, M.cream);

  // side tables
  box(g, bedCX-bW/2-1.6, bedCX-bW/2-0.1, bedCZ-0.7, bedCZ+0.7, FL, FL+2.4, M.woodD);
  box(g, bedCX+bW/2+0.1, bedCX+bW/2+1.6, bedCZ-0.7, bedCZ+0.7, FL, FL+2.4, M.woodD);

  // wardrobe
  box(g, bedCX-bW/2, bedCX-bW/2+5.0, fz(1643)+0.15, fz(1643)+2.0, FL, FL+7.5, M.woodD);

  // rug
  box(g, bedCX-bW/2-0.3, bedCX+bW/2+0.3, bedCZ-bD/2-0.3, bedCZ+bD/2+2.5, FL+0.05, FL+0.09, M.rug2, {ns:1});

  addFurnSOL(bedCX-bW/2, bedCX+bW/2, bedCZ-bD/2, bedCZ+bD/2+0.3);
  addFurnSOL(bedCX-bW/2, bedCX-bW/2+5.0, fz(1643)+0.15, fz(1643)+2.0);
}

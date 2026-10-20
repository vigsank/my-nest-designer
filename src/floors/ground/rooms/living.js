import { fx, fz, FL, S } from '../../../core/coords.js';
import { box, pb } from '../../../core/geometry.js';
import { fz_inv } from '../../../core/coords.js';

export function build(g, M, FP, addFurnSOL) {
  const sW = FP.sofaW/2, sD = FP.sofaD;
  const sx = fx(580) - sD/2, sz = fz(1340);

  // dead-code path kept for fidelity (fz_inv used here but box below does actual work)
  pb(g,
    Math.round(156+(sx-sW)*S), Math.round(648+fz_inv(sz-sW/sW)*S),
    Math.round(156+(sx+sD)*S), Math.round(648+fz_inv(sz+FP.sofaW/2)*S),
    FL, FL+1.5, M.fabric);

  box(g, sx, sx+sD, sz-FP.sofaW/2, sz+FP.sofaW/2, FL, FL+1.5, M.fabric);
  box(g, sx+sD-0.3, sx+sD, sz-FP.sofaW/2, sz+FP.sofaW/2, FL+1.5, FL+3.0, M.fabric);
  box(g, sx, sx+0.3, sz-FP.sofaW/2, sz+FP.sofaW/2, FL+1.5, FL+2.2, M.fabric);
  box(g, sx+sD-0.3, sx+sD, sz-FP.sofaW/2-0.3, sz-FP.sofaW/2+0.3, FL, FL+2.2, M.fabric);
  box(g, sx+sD-0.3, sx+sD, sz+FP.sofaW/2-0.3, sz+FP.sofaW/2+0.3, FL, FL+2.2, M.fabric);
  addFurnSOL(sx, sx+sD, sz-FP.sofaW/2, sz+FP.sofaW/2);

  // rug
  box(g, sx-0.15, sx+sD+2.5, sz-FP.sofaW/2-0.5, sz+FP.sofaW/2+0.5, FL+0.05, FL+0.1, M.rug, {ns:1});

  // coffee table
  box(g, sx+sD+0.4, sx+sD+0.4+2.5, sz-0.75, sz+0.75, FL+0.1, FL+1.5, M.woodD);
  box(g, sx+sD+0.4, sx+sD+0.4+2.5, sz-0.75, sz+0.75, FL+1.5, FL+1.6, M.wood);

  // armchair
  box(g, fx(250), fx(330), fz(1460), fz(1505), FL, FL+1.5, M.fabric);
  box(g, fx(322), fx(330), fz(1460), fz(1505), FL+1.5, FL+2.8, M.fabric);
}

import { fx, fz, FL } from '../../core/coords.js';
import { box } from '../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  // basin shelf + pedestal
  box(g, fx(502), fx(542), fz(1700), fz(1735), FL+2.4, FL+2.9, M.white);
  box(g, fx(505), fx(530), fz(1706), fz(1730), FL, FL+2.4, M.white);
}

import { FL } from '../../core/coords.js';
import { pb } from '../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  pb(g, 745, 1296, 850, 1300, FL+6.5, FL+6.7, M.light, {ns:1});
}

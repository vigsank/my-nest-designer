import { pb } from '../../../core/geometry.js';
import { FL } from '../../../core/coords.js';
import { std } from '../../../core/materials.js';

export function build(g, M, FP, addFurnSOL) {
  pb(g, 200, 1560, 276, 1630, FL+0.05, FL+0.09, std(0x5b6270, 1), {ns:1});
}

import { fx, fz, FL } from '../../../core/coords.js';
import { box, pb } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  const cd = FP.counterD;
  const S = 29.5;

  // north counter (along z=fz(832))
  pb(g, 657, 832, 976, Math.round(648+(fz(832)+cd)*S), FL, FL+2.95, M.cab);
  pb(g, 657, 832, 976, Math.round(648+(fz(832)+cd)*S), FL+2.95, FL+3.1, M.counter, {ns:1});

  // east counter (along x=fx(976))
  box(g, fx(976)-cd, fx(976), fz(832)+cd, fz(1170), FL, FL+2.95, M.cab);
  box(g, fx(976)-cd, fx(976), fz(832)+cd, fz(1170), FL+2.95, FL+3.1, M.counter, {ns:1});

  // uppers north
  pb(g, 660, 838, 890, 868, FL+5.2, FL+7.6, M.cabU);

  // fridge NE corner
  box(g, fx(976)-cd, fx(976), fz(832), fz(832)+cd, FL, FL+6.2, M.steel);

  // hob
  pb(g, 760, 838, 830, 868, FL+3.1, FL+3.2, M.dark, {ns:1});

  // sink
  pb(g, 895, 887, 960, 915, FL+3.05, FL+3.15, M.steel, {ns:1});

  // uppers east
  box(g, fx(976)-cd, fx(976), fz(900), fz(1100), FL+5.2, FL+7.6, M.cabU);

  addFurnSOL(fx(657), fx(976), fz(832), fz(832)+cd);
  addFurnSOL(fx(976)-cd, fx(976), fz(832), fz(1170));
}

import { fx, fz, FL } from '../../../core/coords.js';
import { box, pb } from '../../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  const cd = FP.counterD;
  const S = 29.5;

  // ── west counter arm (facing dining — DO NOT CHANGE) ──
  pb(g, 657, 832, Math.round(657+cd*S), 1022, FL, FL+2.95, M.cab);
  pb(g, 657, 832, Math.round(657+cd*S), 1022, FL+2.95, FL+3.1, M.counter, {ns:1});

  // ── north counter (full width, faces south) ──
  const nz1 = fz(832) + cd;
  box(g, fx(657), fx(976), fz(832), nz1, FL, FL+2.95, M.cab);
  box(g, fx(657), fx(976), fz(832), nz1, FL+2.95, FL+3.1, M.counter, {ns:1});
  // four-burner hob slab (centred on north counter)
  box(g, fx(760), fx(855), fz(832)+0.15, nz1-0.1, FL+3.1, FL+3.22, M.dark, {ns:1});
  // sink
  box(g, fx(888), fx(960), fz(832)+0.2, nz1-0.15, FL+3.04, FL+3.16, M.steel, {ns:1});
  // chimney above hob: steel box from upper-cab height to near ceiling
  box(g, fx(775), fx(840), fz(832), fz(832)+0.3, FL+5.5, FL+8.5, M.steel);
  // overhead uppers north (0.5ft deep from wall, full width)
  box(g, fx(660), fx(976), fz(832), fz(832)+0.5, FL+5.2, FL+7.6, M.cabU);

  // ── east counter (full height, faces west) ──
  const ex0 = fx(976) - cd;
  // fridge NE corner (keep)
  box(g, ex0, fx(976), fz(832), fz(832)+cd, FL, FL+6.2, M.steel);
  // base cabinets south of fridge
  box(g, ex0, fx(976), fz(832)+cd, fz(1170), FL, FL+2.95, M.cab);
  box(g, ex0, fx(976), fz(832)+cd, fz(1170), FL+2.95, FL+3.1, M.counter, {ns:1});
  // dishwasher panel (face panel on west side, just south of fridge)
  box(g, ex0-0.05, ex0, fz(832)+cd, fz(832)+cd+2, FL, FL+2.95, M.steel);
  // overhead uppers east (0.5ft deep from wall)
  box(g, fx(976)-0.5, fx(976), fz(880), fz(1160), FL+5.2, FL+7.6, M.cabU);

  // ── south counter (full width, faces north) ──
  const sz0 = fz(1170) - cd;
  box(g, fx(660), fx(976), sz0, fz(1170), FL, FL+2.95, M.cab);
  box(g, fx(660), fx(976), sz0, fz(1170), FL+2.95, FL+3.1, M.counter, {ns:1});
  // tall cutlery unit at west end (1.5ft wide, floor to FL+7)
  box(g, fx(660), fx(660)+1.5, sz0, fz(1170), FL, FL+7.0, M.cab);
  // two more tall storage units spaced along south wall
  box(g, fx(660)+3.5, fx(660)+5.0, sz0, fz(1170), FL, FL+7.0, M.cab);
  box(g, fx(660)+7.0, fx(660)+8.5, sz0, fz(1170), FL, FL+7.0, M.cab);
  // overhead uppers south (0.5ft deep from wall, full width)
  box(g, fx(660), fx(976), fz(1170)-0.5, fz(1170), FL+5.2, FL+7.6, M.cabU);

  // ── collision boxes ──
  addFurnSOL(fx(657), fx(657)+cd, fz(832), fz(1022));  // west arm
  addFurnSOL(fx(657), fx(976), fz(832), nz1);           // north counter
  addFurnSOL(ex0, fx(976), fz(832), fz(1170));          // east counter + fridge
  addFurnSOL(fx(660), fx(976), sz0, fz(1170));          // south counter
}

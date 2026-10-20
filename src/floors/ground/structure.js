import * as THREE from 'three';
import { fx, fz, FL, H, TH } from '../../core/coords.js';
import { box, pb, sb } from '../../core/geometry.js';
import { wall, doorLeaf, doorArc } from '../../core/joinery.js';

export function buildStructure(g, M, appState) {
  appState.SOL.length = 0;
  appState.CAP = (appState.st.cut && appState.st.mode !== 'walk') ? FL + 3.5 : 1e9;
  const showRoof = (appState.st.roof || appState.st.mode === 'walk') && appState.CAP > 1e8;

  // plinth
  [[215,735,673,1643],[657,825,985,1643],[156,1508,283,1740],[480,1643,985,1985],[215,1643,480,1740]].forEach(r =>
    pb(g, r[0], r[1], r[2], r[3], 0, FL, M.plinth, {ns:1})
  );

  // floors
  const fl = (r, m) => pb(g, r[0], r[1], r[2], r[3], FL, FL+0.05, m, {ns:1});
  fl([215,735,673,1643], M.floor); fl([657,825,985,1643], M.floor);
  fl([156,1508,283,1740], M.porch);
  fl([222,743,357,931], M.floorP);
  fl([657,832,976,1170], M.floorK);
  fl([650,1650,976,1978], M.floorB);
  fl([497,1648,640,1978], M.floorW); fl([805,1537,976,1643], M.floorW);
  for (let i = 0; i < 3; i++) pb(g, 156, 1740+i*30, 281, 1770+i*30, 0, FL-0.5*(i+1)+0.5, M.porch);

  // porch step railing — steel posts + sloped top rail
  {
    const rx = 281, rthk = 3;
    const stepZ = [1643,1740,1770,1800,1830];
    const stepY = [FL, FL, FL-0.5, FL-1.0, FL-1.5];
    const railH = 3.0;
    const drawRail = (rx, sz, sy) => {
      for (let i = 0; i < sz.length; i++) {
        const pz = sz[i], py = sy[i];
        pb(g, rx-rthk, pz-rthk, rx+rthk, pz+rthk, py, py+railH, M.steel);
      }
      for (let i = 0; i < sz.length-1; i++) {
        const z0 = sz[i], z1 = sz[i+1], y0 = sy[i]+railH, y1 = sy[i+1]+railH;
        const railG = new THREE.BufferGeometry();
        const vx0 = fx(rx-rthk), vx1 = fx(rx+rthk);
        const vz0 = fz(z0), vz1 = fz(z1);
        const pos = new Float32Array([
          vx0,y0,vz0, vx1,y0,vz0, vx1,y1,vz1, vx0,y1,vz1,
          vx0,y0-0.08,vz0, vx1,y0-0.08,vz0, vx1,y1-0.08,vz1, vx0,y1-0.08,vz1
        ]);
        const idx = [0,1,2,0,2,3,4,6,5,4,7,6,0,4,5,0,5,1,2,6,7,2,7,3,0,7,4,0,3,7,1,5,6,1,6,2];
        railG.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        railG.setIndex(idx); railG.computeVertexNormals();
        g.add(new THREE.Mesh(railG, M.steel));
      }
    };
    drawRail(281, stepZ, stepY);
    drawRail(156, stepZ, stepY);
  }
  pb(g, 418, 700, 595, 735, 0, 0.75, M.porch);

  // columns
  [[215,735,231,781],[215,1131,231,1177],[215,1471,231,1518],[628,735,673,753],[967,735,984,781],[478,1160,523,1178],[967,1120,982,1165],
   [476,1637,523,1651],[967,1640,983,1685],[156,1940,172,1990],[478,1970,524,1986],[967,1941,984,1986]].forEach(r => {
    sb(g, r[0], r[1], r[2], r[3], (r[1]>1900&&r[0]<300)?0:FL, FL+H, M.col);
    appState.SOL.push([fx(r[0]), fx(r[2]), fz(r[1]), fz(r[3])]);
  });

  // walls with joinery
  wall(g, false, 743, 222, 673, [
    {a:259, b:318, s:0, e:6, k:'win', mk:1, label:"2'×6'"},
    {a:418, b:595, s:0, e:7, k:'sd', label:"SD 6'×7'"}
  ], M);
  wall(g, true, 222, 735, 1518, [{a:937,b:1071,s:1.5,e:7.5,k:'win'},{a:1071,b:1131,s:3,e:7,k:'win'},{a:1393,b:1471,s:3,e:7,k:'win'}], M);
  wall(g, false, 931, 222, 358, [], M);
  wall(g, true, 355, 868, 935, [], M);
  wall(g, true, 673, 735, 825, [{a:756,b:822,s:0,e:7,k:'door',label:"D1 2'6\"×7'"}], M);
  wall(g, false, 832, 657, 984, [
    {a:898, b:958, s:3.5, e:5.5, k:'win', mk:1, label:"2'×2'"}
  ], M);
  wall(g, true, 976, 825, 1978, [
    {a:880, b:1086, s:3, e:6.5, k:'win', mk:1, label:"7'×3.5'"},
    {a:1192, b:1250, s:3.5, e:7.5, k:'win', label:"W1 2'×4'"},
    {a:1460, b:1520, s:3.5, e:7.5, k:'win', label:"W1 2'×4'"},
    {a:1541, b:1615, s:0, e:7, k:'door', label:"D1"},
    {a:1895, b:1945, s:3, e:7, k:'win', label:"W1 2'×4'"}
  ], M);
  wall(g, false, 1170, 657, 984, [], M);
  wall(g, true, 285, 1513, 1643, [{a:1519,b:1637,s:0,e:7,k:'door',label:"MD 4'×7'"}], M);
  wall(g, false, 1513, 222, 330, [], M);
  wall(g, false, 1513, 452, 490, [], M);
  wall(g, true, 487, 1513, 1978, [{a:1666,b:1725,s:3,e:7,k:'win',label:"W4 2'×4'"}], M);
  wall(g, false, 1643, 285, 545, [{a:351,b:470,s:3,e:7,k:'win',label:"W 4'×4'"}], M);
  wall(g, false, 1643, 545, 640, [{a:556,b:629,s:0,e:7,k:'door',label:"D1"}], M);
  wall(g, false, 1787, 487, 640, [], M);
  wall(g, true, 640, 1643, 1978, [{a:1790,b:1864,s:0,e:7,k:'door',label:"D1"}], M);
  wall(g, false, 1643, 640, 984, [
    {a:650, b:740, s:0, e:7, k:'door', label:"D 3'×7'"}
  ], M);
  wall(g, true, 800, 1533, 1643, [], M);
  wall(g, false, 1533, 797, 984, [], M);
  wall(g, false, 1978, 478, 984, [
    {a:531, b:590, s:5, e:7, k:'v1', label:"V1 2'×2'"},
    {a:696, b:872, s:3, e:7, k:'win', label:"W2 6'×4'"}
  ], M);

  // door leaves + arcs
  doorLeaf(g, 673, 822, 1, 0, 2.2, M);
  doorArc(g, 673, 822, 2.2, [1,0], 1);
  doorLeaf(g, 285, 1637, 1, 0, 3.5, M);
  doorArc(g, 285, 1637, 3.5, [1,0], 1);
  doorLeaf(g, 650, 1645, 0, 1, 3.0, M);
  doorArc(g, 650, 1645, 3.0, [0,1], 1);
  doorLeaf(g, 640, 1790, -1, 0, 2.3, M);
  doorArc(g, 640, 1790, 2.3, [-1,0], 1);
  doorLeaf(g, 556, 1643, 1, 0, 2.3, M);
  doorArc(g, 556, 1643, 2.3, [1,0], 1);
  doorLeaf(g, 976, 1541, 0, 1, 2.3, M);
  doorArc(g, 976, 1541, 2.3, [0,1], 1);

  // slatted partition dining/living
  const S = 29.5;
  const slats = (a, b) => {
    const n = Math.round((b-a)/S/0.4);
    for (let i = 0; i <= n; i++) { const x = a+(b-a)*i/n; sb(g, x-2, 1167, x+2, 1173, FL, FL+7.5, M.woodD); }
    sb(g, a, 1167, b, 1173, FL+7.5, FL+7.7, M.woodD);
    sb(g, a, 1167, b, 1173, FL, FL+0.2, M.woodD);
  };
  slats(360, 478); slats(523, 550);

  // lift shaft
  sb(g, 722, 1275, 865, 1290, FL, FL+H, M.lift); sb(g, 722, 1423, 865, 1440, FL, FL+H, M.lift);
  sb(g, 722, 1290, 737, 1320, FL, FL+H, M.lift); sb(g, 722, 1390, 737, 1423, FL, FL+H, M.lift);
  sb(g, 855, 1290, 865, 1423, FL, FL+H, M.lift); sb(g, 722, 1320, 737, 1390, FL+7, FL+H, M.lift);
  sb(g, 724, 1322, 729, 1388, FL, FL+7, M.steel);
  sb(g, 737, 1290, 855, 1423, 0, FL+0.1, M.dark);
  appState.SOL.push([fx(722), fx(865), fz(1275), fz(1440)]);

  // stair
  const r = 10/16;
  const stepA = (865+5-722)/6;
  for (let i = 0; i < 6; i++) {
    const x0 = 722+i*stepA, x1 = x0+stepA, y = FL+(i+1)*r;
    sb(g, x0, 1178, x1, 1275, y-0.25, y, M.stone);
    sb(g, x0, 1178, x0+3, 1275, y-r, y, M.stone);
  }
  sb(g, 870, 1178, 968, 1275, FL+7*r-0.3, FL+7*r, M.stone);
  const stepB = (1525-1275)/9;
  for (let j = 0; j < 9; j++) {
    const y0 = 1275+j*stepB, y1 = y0+stepB, y = FL+(8+j)*r;
    sb(g, 870, y0, 968, y1, y-0.25, y, M.stone);
    sb(g, 870, y0, 968, y0+3, y-r, y, M.stone);
  }
  sb(g, 866, 1290, 869, 1525, FL+4.4, FL+7.4, M.glass);

  if (showRoof) {
    [[215,735,673,1513],[657,825,985,1985],[215,1513,657,1643],[480,1643,657,1985]].forEach(r => {
      const m = pb(g, r[0]-6, r[1]-6, r[2]+6, r[3]+6, FL+H, FL+H+0.6, M.slab, {});
      if (m) m.castShadow = false;
    });
  }
}

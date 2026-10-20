import * as THREE from 'three';
import { fx, fz, FL } from '../../core/coords.js';
import { box, pb, cyl, ball } from '../../core/geometry.js';
import { std } from '../../core/materials.js';

export function buildSite(g, M, appState) {
  pb(g, 156, 648, 1041, 2120, 0, 0.06, M.paving, {ns:1});
  pb(g, 156, 1643, 480, 2120, 0.06, 0.1, M.park, {ns:1});
  pb(g, 480, 1990, 1041, 2120, 0.06, 0.18, M.grass, {ns:1});

  const pts = [[156,648],[1041,648],[1041,2120],[156,2120],[156,648]]
    .map(p => new THREE.Vector3(fx(p[0]), 0.2, fz(p[1])));
  g.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({color: 0x6b7686})
  ));

  [[160,1700,160,2116],[476,1700,476,2116]].forEach(l => {
    pb(g, l[0]-1, l[1], l[2]+1, l[3], 0.1, 0.13, std(0xf3f0e8, 1), {ns:1});
  });

  const shrub = (px, py, r, m) => {
    const x = fx(px), z = fz(py);
    cyl(g, x, 0.1, z, 0.12, 0.8, M.trunk, 8);
    ball(g, x, 0.8+r*0.8, z, r, m, 0.85);
  };
  shrub(518, 2040, 1.3, M.leaf); shrub(633, 2040, 1.3, M.leaf);

  const palm = (px, py, s) => {
    const x = fx(px), z = fz(py);
    for (let i = 0; i < 7; i++) {
      const a = i/7*Math.PI*2;
      const cn = new THREE.Mesh(new THREE.ConeGeometry(0.28*s, 2.2*s, 5), M.leaf2);
      cn.position.set(x+Math.cos(a)*0.7*s, 0.75*s+0.5, z+Math.sin(a)*0.7*s);
      cn.rotation.z = Math.cos(a)*1.0; cn.rotation.x = -Math.sin(a)*1.0;
      cn.castShadow = true; g.add(cn);
    }
    cyl(g, x, 0.1, z, 0.14*s, 1.6*s, M.trunk, 8);
  };
  palm(578, 2085, 1); palm(710, 2010, 1); palm(1005, 2000, 1.1); palm(1010, 2062, 1.4);

  const cluster = (px, py, m) => {
    const x = fx(px), z = fz(py);
    ball(g, x, 0.8, z, 0.9, m, .7); ball(g, x+0.9, 0.7, z+0.5, 0.7, m, .7); ball(g, x-0.7, 0.65, z+0.7, 0.6, m, .7);
  };
  cluster(688, 2085, M.leaf3); cluster(905, 2018, M.leaf3); cluster(940, 2040, M.leaf2); cluster(730, 2060, M.leaf2);
  shrub(908, 2085, 0.9, M.leaf);

  // indoor planter
  pb(g, 232, 937, 357, 1071, FL, FL+1.0, M.stone);
  pb(g, 236, 941, 353, 1067, FL+1.0, FL+1.06, M.soil, {ns:1});
  appState.SOLX.push([fx(232), fx(357), fz(937), fz(1071)]);
  const x1 = fx(272), z1 = fz(985);
  cyl(g, x1, FL+1, z1, 0.1, 0.8, M.trunk, 8);
  ball(g, x1, FL+2.5, z1, 1.15, M.leaf, .9);
  palm(325, 1040, .55); palm(345, 985, .5); palm(300, 1050, .45);

  // car
  const carGrp = new THREE.Group();
  const cx = fx(367), cz = fz(1902);
  carGrp.position.set(cx, 0.1, cz);
  box(carGrp, -2.6, 2.6, -5.4, 5.4, 0.7, 1.9, M.car);
  box(carGrp, -2.2, 2.2, -1.6, 2.6, 1.9, 3.0, M.carG);
  box(carGrp, -2.0, 2.0, -1.4, 2.4, 3.0, 3.1, M.car);
  box(carGrp, -2.3, -1.4, -5.5, -5.35, 1.1, 1.5, M.light, {ns:1});
  box(carGrp, 1.4, 2.3, -5.5, -5.35, 1.1, 1.5, M.light, {ns:1});
  [[-2.5,-3.4],[2.5,-3.4],[-2.5,3.4],[2.5,3.4]].forEach(p => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.7, 18), M.tire);
    w.rotation.z = Math.PI/2; w.position.set(p[0], 0.95, p[1]); w.castShadow = true; carGrp.add(w);
  });
  g.add(carGrp);
  appState.SOLX.push([cx-2.7, cx+2.7, cz-5.5, cz+5.5]);

  return carGrp;
}

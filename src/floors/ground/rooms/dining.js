import * as THREE from 'three';
import { fx, fz, FL } from '../../core/coords.js';
import { box } from '../../core/geometry.js';

export function build(g, M, FP, addFurnSOL) {
  const dW = FP.diningW/2, dD = FP.diningD/2;
  const tx = fx(503), tz = fz(960);

  const tbl = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2.3, 32), M.woodD);
  tbl.scale.set(dW, 1, dD);
  tbl.position.set(tx, FL+1.15, tz);
  tbl.castShadow = true; g.add(tbl);

  const top = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.15, 32), M.wood);
  top.scale.set(dW+0.1, 1, dD+0.1);
  top.position.set(tx, FL+2.3+0.075, tz);
  top.castShadow = true; g.add(top);

  const chair = (x, z, rot) => {
    const c = new THREE.Group(); c.position.set(x, FL, z); c.rotation.y = rot;
    box(c, -0.65, 0.65, -0.65, 0.65, 1.35, 1.6, M.fabricD);
    box(c, -0.65, -0.5, -0.65, -0.5, 0, 1.35, M.woodD);
    box(c, 0.5, 0.65, -0.65, -0.5, 0, 1.35, M.woodD);
    box(c, -0.65, -0.5, 0.5, 0.65, 0, 1.35, M.woodD);
    box(c, 0.5, 0.65, 0.5, 0.65, 0, 1.35, M.woodD);
    box(c, -0.65, 0.65, 0.5, 0.7, 1.6, 3.0, M.fabricD);
    g.add(c);
  };
  const chairOff = dD + 0.95;
  [-dW-0.9, dW+0.9].forEach(xo => {
    [-dD*0.5, 0, dD*0.5].forEach(zo => {
      chair(tx+xo, tz+zo, (xo < 0 ? Math.PI/2 : -Math.PI/2));
    });
  });
  chair(tx, tz-chairOff, Math.PI);
  chair(tx, tz+chairOff, 0);

  addFurnSOL(tx-dW-1.0, tx+dW+1.0, tz-dD-0.9, tz+dD+0.9);
}

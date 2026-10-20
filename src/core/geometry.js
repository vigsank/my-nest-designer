import * as THREE from 'three';
import { fx, fz } from './coords.js';
import { appState } from '../state.js';

export function box(g, x0, x1, z0, z1, y0, y1, m, o) {
  o = o || {};
  if (x0 > x1) [x0, x1] = [x1, x0];
  if (z0 > z1) [z0, z1] = [z1, z0];
  if (o.s && y1 > appState.CAP) y1 = appState.CAP;
  if (y1 - y0 < 0.01 || x1 - x0 < 0.005 || z1 - z0 < 0.005) return null;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(x1-x0, y1-y0, z1-z0), m);
  mesh.position.set((x0+x1)/2, (y0+y1)/2, (z0+z1)/2);
  mesh.castShadow = !o.ns; mesh.receiveShadow = true; g.add(mesh); return mesh;
}

export const pb = (g, a, b, c, d, y0, y1, m, o) => box(g, fx(a), fx(c), fz(b), fz(d), y0, y1, m, o);
export const sb = (g, a, b, c, d, y0, y1, m) => box(g, fx(a), fx(c), fz(b), fz(d), y0, y1, m, {s:1});

export function cyl(g, x, y, z, r, h, m, seg, sx, sz) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg||24), m);
  mesh.position.set(x, y+h/2, z);
  if (sx || sz) mesh.scale.set(sx||1, 1, sz||1);
  mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh); return mesh;
}

export function ball(g, x, y, z, r, m, sy) {
  const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), m);
  mesh.position.set(x, y, z);
  if (sy) mesh.scale.y = sy;
  mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh); return mesh;
}

export function disposeGroup(g) {
  g.traverse(o => { if (o.geometry) o.geometry.dispose(); });
}

import * as THREE from 'three';
import { fx, fz, FL, H, TH } from './coords.js';
import { box, sb } from './geometry.js';
import { appState } from '../state.js';

const _doorHitMat = new THREE.MeshBasicMaterial({ visible: false });

export function frameBars(g, vert, cf, u0, u1, y0, y1, mullions, M) {
  const d = 0.36, t = 0.1;
  const ub = (a, b, ya, yb) => vert
    ? box(g, cf-d/2, cf+d/2, a, b, ya, yb, M.frame, {s:1})
    : box(g, a, b, cf-d/2, cf+d/2, ya, yb, M.frame, {s:1});
  ub(u0, u1, y0, y0+t); ub(u0, u1, y1-t, y1); ub(u0, u0+t, y0, y1); ub(u1-t, u1, y0, y1);
  for (let i = 1; i <= mullions; i++) {
    const u = u0 + (u1-u0)*i/(mullions+1);
    ub(u-t/2, u+t/2, y0, y1);
  }
}

export function ventBars(g, vert, cf, u0, u1, y0, y1, M) {
  const d = 0.36, t = 0.06, n = 4;
  const ub = (a, b, ya, yb) => vert
    ? box(g, cf-d/2, cf+d/2, a, b, ya, yb, M.vent, {s:1})
    : box(g, a, b, cf-d/2, cf+d/2, ya, yb, M.vent, {s:1});
  for (let i = 0; i <= n; i++) { const y = y0 + (y1-y0)*i/n; ub(u0, u1, y-t/2, y+t/2); }
  ub(u0, u0+t, y0, y1); ub(u1-t, u1, y0, y1);
}

export function glassPane(g, vert, c, o, M, marks, yBase) {
  if (yBase === undefined) yBase = FL;
  const y0 = yBase + o.s, y1 = Math.min(yBase + o.e, appState.CAP);
  if (y1 - y0 < 0.1) return;
  const cf = vert ? fx(c) : fz(c);
  const u0 = vert ? fz(o.a) : fx(o.a);
  const u1 = vert ? fz(o.b) : fx(o.b);
  const len = u1 - u0;
  let glMat = M.glass;
  if (o.mk && marks) glMat = M.glassMk;
  else if (o.k === 'fg') glMat = M.glassFG;
  else if (o.k === 'sd') glMat = M.glassSD;
  if (o.k === 'v1') {
    ventBars(g, vert, cf, u0, u1, y0, y1, M); return;
  }
  const gm = vert
    ? box(g, cf-0.05, cf+0.05, u0, u1, y0, y1, glMat, {ns:1, s:1})
    : box(g, u0, u1, cf-0.05, cf+0.05, y0, y1, glMat, {ns:1, s:1});
  if (gm && o.label) gm.userData.joinery = o.label;
  if (o.k === 'sd') {
    const mid = (u0+u1)/2;
    if (vert) {
      box(g, cf-0.07, cf+0.01, u0, mid+0.1, y0, y1, glMat, {ns:1, s:1});
      box(g, cf-0.01, cf+0.07, mid-0.1, u1, y0, y1, glMat, {ns:1, s:1});
    } else {
      box(g, u0, mid+0.1, cf-0.07, cf+0.01, y0, y1, glMat, {ns:1, s:1});
      box(g, mid-0.1, u1, cf-0.01, cf+0.07, y0, y1, glMat, {ns:1, s:1});
    }
    frameBars(g, vert, cf, u0, u1, y0, y1, 1, M);
  } else {
    frameBars(g, vert, cf, u0, u1, y0, y1, len > 4.5 ? 1 : 0, M);
  }
}

export function wall(g, vert, c, a, b, ops, M, yBase) {
  if (yBase === undefined) yBase = FL;
  ops = (ops || []).slice().sort((p, q) => p.a - q.a);
  const seg = (u0, u1, y0, y1, solid) => {
    if (u1 - u0 < 1) return;
    const r = vert
      ? [c-TH/2, u0, c+TH/2, u1]
      : [u0, c-TH/2, u1, c+TH/2];
    sb(g, r[0], r[1], r[2], r[3], y0, y1, M.wall);
    if (solid) appState.SOL.push([fx(r[0]), fx(r[2]), fz(r[1]), fz(r[3])]);
  };
  let cur = a;
  for (const o of ops) {
    seg(cur, o.a, yBase, yBase+H, true);
    if (o.s > 0) seg(o.a, o.b, yBase, yBase+o.s, false);
    if (o.e < H) seg(o.a, o.b, yBase+o.e, yBase+H, false);
    if (o.k === 'win' || o.k === 'sd' || o.k === 'fg' || o.k === 'v1') {
      glassPane(g, vert, c, o, M, appState.st.marks, yBase);
      const r = vert
        ? [c-TH/2, o.a, c+TH/2, o.b]
        : [o.a, c-TH/2, o.b, c+TH/2];
      appState.SOL.push([fx(r[0]), fx(r[2]), fz(r[1]), fz(r[3])]);
    } else if (o.k === 'door' && o.label) {
      // invisible hit-target box so the tooltip raycaster can find the door opening
      const d = TH / 2;
      const hm = vert
        ? new THREE.Mesh(new THREE.BoxGeometry(d*2/29.5, Math.min(7, H), (o.b-o.a)/29.5), _doorHitMat)
        : new THREE.Mesh(new THREE.BoxGeometry((o.b-o.a)/29.5, Math.min(7, H), d*2/29.5), _doorHitMat);
      hm.position.set(
        vert ? fx(c) : (fx(o.a)+fx(o.b))/2,
        yBase + Math.min(7, H)/2,
        vert ? (fz(o.a)+fz(o.b))/2 : fz(c)
      );
      hm.userData.joinery = o.label;
      g.add(hm);
    }
    cur = o.b;
  }
  seg(cur, b, yBase, yBase+H, true);
}

export function doorLeaf(g, hx, hy, dx, dz, L, M, yBase) {
  if (yBase === undefined) yBase = FL;
  const h = Math.min(6.9, appState.CAP - yBase);
  if (h < 0.1) return;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(L, h, 0.16), M.door);
  mesh.position.set(fx(hx)+dx*L/2, yBase+h/2, fz(hy)+dz*L/2);
  mesh.rotation.y = Math.atan2(-dz, dx);
  mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh);
}

export function doorArc(g, hx, hy, L, axis, dir, yBase) {
  if (yBase === undefined) yBase = FL;
  const pts = [], n = 12;
  for (let i = 0; i <= n; i++) {
    const a = i/n * (Math.PI/2) * dir;
    pts.push(new THREE.Vector3(Math.cos(a)*L*axis[0], 0, Math.sin(a)*L*axis[1]));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({color:0xaaaaaa, opacity:.5, transparent:true}));
  line.position.set(fx(hx), yBase+0.06, fz(hy));
  g.add(line);
}

import { fx, fz, FL, S } from '../core/coords.js';

export const walkState = { x: fx(305), z: fz(1600), yaw: -Math.PI / 2, pitch: 0, keys: { f: 0, b: 0, l: 0, r: 0 }, y: FL + 5.4 };

function inPlinth(x, z) {
  const px = x * S + 156, pz = z * S + 648;
  return [[215, 735, 673, 1643], [657, 825, 985, 1643], [156, 1508, 283, 1740], [480, 1643, 985, 1985]]
    .some(r => px >= r[0] && px <= r[2] && pz >= r[1] && pz <= r[3]);
}

export function blocked(x, z, appState) {
  const R = 0.75;
  for (const s of appState.SOL.concat(appState.SOLX)) {
    if (x > s[0] - R && x < s[1] + R && z > s[2] - R && z < s[3] + R) return true;
  }
  return x < 0.5 || x > 29.5 || z < 0.5 || z > 49.5;
}

export function walkStep(dt, appState) {
  const f = walkState.keys.f - walkState.keys.b;
  const r = walkState.keys.r - walkState.keys.l;
  if (!f && !r) return;
  const sp = 7 * dt;
  const sy = Math.sin(walkState.yaw), cy = Math.cos(walkState.yaw);
  const dx = (-sy * f + cy * r) * sp, dz = (-cy * f - sy * r) * sp;
  if (!blocked(walkState.x + dx, walkState.z, appState)) walkState.x += dx;
  if (!blocked(walkState.x, walkState.z + dz, appState)) walkState.z += dz;
}

export function applyWalkCam(dt, camera) {
  const ty = (inPlinth(walkState.x, walkState.z) ? FL : 0) + 5.4;
  walkState.y += (ty - walkState.y) * Math.min(1, dt * 8);
  camera.position.set(walkState.x, walkState.y, walkState.z);
  camera.rotation.set(walkState.pitch, walkState.yaw, 0, 'YXZ');
}

export function currentRoom(rooms) {
  for (const rm of rooms) {
    if (walkState.x >= rm.x0 && walkState.x <= rm.x1 && walkState.z >= rm.z0 && walkState.z <= rm.z1) return rm;
  }
  return null;
}

export function updateHUD(rooms, FP, appState) {
  const hud = document.getElementById('hud');
  if (!appState.st.hud) { hud.style.display = 'none'; return; }
  hud.style.display = 'block';
  const rm = currentRoom(rooms);
  if (rm) {
    document.getElementById('hud-room').textContent = rm.name;
    document.getElementById('hud-dim').textContent = rm.dim;
    const fl = rm.furn.map(f => {
      let w = f.w || '', d = f.d || '';
      if (f.wKey) w = FP[f.wKey].toFixed(1) + "'";
      if (f.dKey) d = FP[f.dKey].toFixed(1) + "'";
      return `${f.n}${w ? ': ' + w : ''}${d ? ' × ' + d : ''}`;
    }).join(' | ');
    document.getElementById('hud-furn').textContent = fl || 'No furniture';
  } else {
    document.getElementById('hud-room').textContent = 'Outside';
    document.getElementById('hud-dim').textContent = '';
    document.getElementById('hud-furn').textContent = '';
  }
}

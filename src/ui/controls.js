import { walkState } from './walkMode.js';
import * as THREE from 'three';
import { FL } from '../core/coords.js';

const KM = {
  ArrowUp: 'f', w: 'f', W: 'f',
  ArrowDown: 'b', s: 'b', S: 'b',
  ArrowLeft: 'l', a: 'l', A: 'l',
  ArrowRight: 'r', d: 'r', D: 'r',
};

export function initControls(opts) {
  const {
    canvas, stage, camera, controls, appState,
    furnGrp, carGrp, rulerState,
    rebuild, rebuildFurniture, refreshCardContent,
    labelSystem, ROOMS, filterSliders,
  } = opts;

  const hint    = document.getElementById('hint');
  const pad     = document.getElementById('pad');
  const hudEl   = document.getElementById('hud');
  const hudTg   = document.getElementById('hud-toggle');

  let drag = null;

  canvas.addEventListener('pointerdown', e => {
    if (appState.st.mode === 'walk') {
      drag = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
    }
  });

  canvas.addEventListener('pointermove', e => {
    if (drag && appState.st.mode === 'walk') {
      walkState.yaw += (e.clientX - drag.x) * 0.006;
      walkState.pitch = Math.max(-1.2, Math.min(1.2, walkState.pitch + (e.clientY - drag.y) * 0.005));
      drag = { x: e.clientX, y: e.clientY };
    }
  });

  canvas.addEventListener('pointerup',     () => { drag = null; });
  canvas.addEventListener('pointercancel', () => { drag = null; });

  // Double-click in orbit/top: teleport to room centre and enter walk mode
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(FL + 0.05));
  const raycaster = new THREE.Raycaster();
  const ndcPos = new THREE.Vector2();
  const hitPt = new THREE.Vector3();

  canvas.addEventListener('dblclick', e => {
    if (appState.st.mode === 'walk') return;
    const rect = canvas.getBoundingClientRect();
    ndcPos.set(
      ((e.clientX - rect.left) / rect.width)  * 2 - 1,
      -((e.clientY - rect.top)  / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndcPos, camera);
    if (!raycaster.ray.intersectPlane(floorPlane, hitPt)) return;
    const rm = ROOMS.find(r =>
      hitPt.x >= r.x0 && hitPt.x <= r.x1 && hitPt.z >= r.z0 && hitPt.z <= r.z1
    );
    if (!rm) return;
    walkState.x = (rm.x0 + rm.x1) / 2;
    walkState.z = (rm.z0 + rm.z1) / 2;
    walkState.yaw = -Math.PI / 2;
    walkState.pitch = 0;
    setMode('walk');
  });

  document.querySelectorAll('#pad button').forEach(b => {
    const k = b.dataset.k;
    const on  = e => { walkState.keys[k] = 1; e.preventDefault(); };
    const off = ()  => { walkState.keys[k] = 0; };
    b.addEventListener('pointerdown', on);
    b.addEventListener('pointerup',   off);
    b.addEventListener('pointerleave', off);
    b.addEventListener('pointercancel', off);
  });

  addEventListener('keydown', e => {
    if (e.key === 'Escape' && rulerState.active) {
      e.preventDefault(); return;
    }
    const k = KM[e.key];
    if (k && appState.st.mode === 'walk') { walkState.keys[k] = 1; e.preventDefault(); }
  });

  addEventListener('keyup', e => {
    const k = KM[e.key];
    if (k) walkState.keys[k] = 0;
  });

  function setMode(m) {
    appState.st.mode = m;
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
    controls.enabled = !rulerState.active && m !== 'walk';
    pad.classList.toggle('on', m === 'walk');
    hudEl.style.display  = (m === 'walk' && appState.st.hud) ? 'block' : 'none';
    hudTg.style.display  = m === 'walk' ? 'flex' : 'none';

    if (m === 'orbit') {
      camera.position.set(-31, 55, 89);
      controls.target.set(15, 2, 25);
      controls.minPolarAngle = 0;
      hint.textContent = 'Drag to orbit · pinch or scroll to zoom · double-click a room to enter';
      filterSliders(null);
    }
    if (m === 'plan') {
      camera.position.set(15, 112, 25.2);
      controls.target.set(15, 0, 25);
      hint.textContent = 'Top view · drag / pinch to zoom · double-click a room to enter';
      filterSliders(null);
    }
    if (m === 'walk') {
      hint.textContent = 'Drag to look · arrows or W A S D to move';
      // initial filter based on starting room; frame loop keeps it updated
    }

    camera.fov = m === 'walk' ? 68 : 42;
    camera.updateProjectionMatrix();
    camera.up.set(0, 1, 0);
    if (m !== 'walk') camera.rotation.set(0, 0, 0);
    rebuild();
    controls.update();
  }

  document.querySelectorAll('[data-mode]').forEach(b =>
    b.addEventListener('click', () => setMode(b.dataset.mode))
  );

  document.querySelectorAll('[data-t]').forEach(b =>
    b.addEventListener('click', () => {
      const k = b.dataset.t;
      appState.st[k] = !appState.st[k];
      b.setAttribute('aria-pressed', String(appState.st[k]));

      if (k === 'furn') {
        furnGrp.visible = appState.st.furn;
      } else if (k === 'car') {
        if (carGrp) carGrp.visible = appState.st.car;
      } else if (k === 'hud') {
        hudEl.style.display = (appState.st.hud && appState.st.mode === 'walk') ? 'block' : 'none';
        hudTg.setAttribute('aria-pressed', String(appState.st.hud));
      } else if (k === 'marks') {
        rebuild();
      } else if (k === 'labels' || k === 'winlabels') {
        // labels update happens each frame in updateLabels
      } else {
        rebuild();
      }
    })
  );

  hudTg.addEventListener('click', () => {
    appState.st.hud = !appState.st.hud;
    hudTg.setAttribute('aria-pressed', String(appState.st.hud));
    hudEl.style.display = (appState.st.hud && appState.st.mode === 'walk') ? 'block' : 'none';
  });

  return { setMode };
}

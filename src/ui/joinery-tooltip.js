import * as THREE from 'three';

export function initJoineryTooltip(canvas, stage, camera, scene, appState, rulerState) {
  const tip = document.createElement('div');
  tip.id = 'joinery-tip';
  stage.appendChild(tip);

  const rc = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let lastMove = 0;
  let sticky = null; // label pinned by tap; null = follow hover

  function hit(ex, ey) {
    const rect = canvas.getBoundingClientRect();
    ndc.set(
      ((ex - rect.left) / rect.width)  * 2 - 1,
      -((ey - rect.top)  / rect.height) * 2 + 1,
    );
    rc.setFromCamera(ndc, camera);
    const hits = rc.intersectObjects(scene.children, true);
    for (const h of hits) {
      if (h.object.userData.joinery) return h.object.userData.joinery;
    }
    return null;
  }

  function show(label, ex, ey) {
    const rect = stage.getBoundingClientRect();
    let x = ex - rect.left + 14;
    let y = ey - rect.top  - 36;
    // clamp so tip never overflows the stage
    const tw = tip.offsetWidth || 80;
    x = Math.min(x, rect.width  - tw - 8);
    y = Math.max(y, 8);
    tip.textContent = label;
    tip.style.left    = x + 'px';
    tip.style.top     = y + 'px';
    tip.style.display = 'block';
  }

  function hide() {
    tip.style.display = 'none';
  }

  function blocked() {
    return rulerState.active || appState.st.mode === 'walk';
  }

  // desktop hover
  canvas.addEventListener('pointermove', e => {
    if (blocked() || sticky) return;
    const now = performance.now();
    if (now - lastMove < 16) return;
    lastMove = now;
    const label = hit(e.clientX, e.clientY);
    if (label) show(label, e.clientX, e.clientY);
    else hide();
  });

  let downX = 0, downY = 0;
  canvas.addEventListener('pointerdown', e => {
    downX = e.clientX; downY = e.clientY;
    // any drag start dismisses a sticky tooltip
    if (sticky) { sticky = null; hide(); }
  });

  canvas.addEventListener('pointerup', e => {
    if (blocked()) return;
    const dx = e.clientX - downX, dy = e.clientY - downY;
    if (dx*dx + dy*dy > 25) return; // was a drag, not a tap
    const label = hit(e.clientX, e.clientY);
    if (label) {
      sticky = (sticky === label) ? null : label;
      if (sticky) show(label, e.clientX, e.clientY);
      else hide();
    } else if (sticky) {
      sticky = null; hide();
    }
  });
}

import * as THREE from 'three';
import { FL } from '../core/coords.js';

const NS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

function ftIn(feet) {
  const f = Math.floor(Math.abs(feet));
  const inch = Math.round((Math.abs(feet) - f) * 12);
  if (inch === 12) return `${f + 1}'0"`;
  return `${f}'${inch}"`;
}

function dist3D(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

function worldToScreen(wx, wy, wz, camera, canvasEl) {
  const v = new THREE.Vector3(wx, wy, wz).project(camera);
  const rect = canvasEl.getBoundingClientRect();
  return { x: (v.x * 0.5 + 0.5) * rect.width + rect.left, y: (-v.y * 0.5 + 0.5) * rect.height + rect.top };
}

function drawRulerLine(svg, p0, p1, id, camera, canvasEl) {
  const s0 = worldToScreen(p0.x, p0.y, p0.z, camera, canvasEl);
  const s1 = worldToScreen(p1.x, p1.y, p1.z, camera, canvasEl);
  const rect = canvasEl.getBoundingClientRect();
  const ax = s0.x - rect.left, ay = s0.y - rect.top;
  const bx = s1.x - rect.left, by = s1.y - rect.top;
  const g = svgEl('g', { id: id || '' });
  const dx = bx - ax, dy = by - ay, len = Math.sqrt(dx * dx + dy * dy) || 1;
  const px = -dy / len * 8, py = dx / len * 8;
  g.appendChild(svgEl('line', { x1: ax + px, y1: ay + py, x2: ax - px, y2: ay - py, class: 'end-line' }));
  g.appendChild(svgEl('line', { x1: bx + px, y1: by + py, x2: bx - px, y2: by - py, class: 'end-line' }));
  g.appendChild(svgEl('line', { x1: ax, y1: ay, x2: bx, y2: by }));
  g.appendChild(svgEl('circle', { cx: ax, cy: ay, r: 4 }));
  g.appendChild(svgEl('circle', { cx: bx, cy: by, r: 4 }));
  svg.appendChild(g);
  return { g, mx: (ax + bx) / 2 + rect.left, my: (ay + by) / 2 + rect.top };
}

export function initRuler(canvas, stage, rulerSVG, rulerHint, rulerBtn, camera, scene, controls, appState) {
  const rulerState = { active: false, measuring: false, p0: null, p1: null, unit: 'ft', selected: null };
  const rulerLines = [];
  let liveBadge = null;
  let rulerDrag = false;

  const raycaster = new THREE.Raycaster();
  const rulerPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  function fmtDist(feet) {
    if (rulerState.unit === 'in') return Math.round(Math.abs(feet) * 12) + '"';
    return ftIn(feet);
  }

  function screenTo3D(ex, ey) {
    const rect = canvas.getBoundingClientRect();
    const nx = ((ex - rect.left) / rect.width) * 2 - 1;
    const ny = -((ey - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera({ x: nx, y: ny }, camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    if (hits.length) {
      for (const h of hits) { if (h.point.y > -0.1) return h.point.clone(); }
    }
    rulerPlane.constant = -FL;
    const pt = new THREE.Vector3();
    raycaster.ray.intersectPlane(rulerPlane, pt);
    return pt;
  }

  function ensureLiveBadge() {
    if (!liveBadge) {
      liveBadge = document.createElement('div');
      liveBadge.className = 'ruler-badge';
      liveBadge.style.display = 'none';
      stage.appendChild(liveBadge);
    }
    return liveBadge;
  }

  function rulerSelectLine(id) {
    rulerState.selected = id;
    rulerLines.forEach(rl => { if (rl._badge) rl._badge.classList.toggle('selected', rl.id === id); });
  }

  function rulerDeleteLine(id) {
    const idx = rulerLines.findIndex(r => r.id === id);
    if (idx >= 0) { rulerLines[idx]._badge.remove(); rulerLines.splice(idx, 1); }
    if (rulerState.selected === id) rulerState.selected = null;
    redrawRuler();
  }

  function rulerClearAll() {
    rulerLines.forEach(rl => { if (rl._badge) rl._badge.remove(); });
    rulerLines.length = 0;
    rulerState.selected = null;
    rulerSVG.innerHTML = '';
  }

  function redrawRuler() {
    rulerSVG.innerHTML = '';
    rulerLines.forEach(rl => {
      const { mx, my } = drawRulerLine(rulerSVG, rl.p0, rl.p1, 'rl-' + rl.id, camera, canvas);
      rl._mx = mx; rl._my = my;
    });
    if (rulerState.measuring && rulerState.p0 && rulerState.p1) {
      drawRulerLine(rulerSVG, rulerState.p0, rulerState.p1, 'rl-live', camera, canvas);
    }
    rulerLines.forEach(rl => {
      if (rl._badge) { rl._badge.style.left = rl._mx + 'px'; rl._badge.style.top = rl._my + 'px'; }
    });
    if (rulerState.measuring && rulerState.p0 && rulerState.p1 && liveBadge) {
      const d = dist3D(rulerState.p0, rulerState.p1);
      liveBadge.textContent = '📐 ' + fmtDist(d);
      const s0 = worldToScreen(rulerState.p0.x, rulerState.p0.y, rulerState.p0.z, camera, canvas);
      const s1 = worldToScreen(rulerState.p1.x, rulerState.p1.y, rulerState.p1.z, camera, canvas);
      liveBadge.style.left = ((s0.x + s1.x) / 2) + 'px';
      liveBadge.style.top = ((s0.y + s1.y) / 2 - 18) + 'px';
      liveBadge.style.display = 'block';
    } else if (liveBadge) { liveBadge.style.display = 'none'; }
  }

  canvas.addEventListener('pointerdown', e => {
    if (!rulerState.active) return;
    const pt = screenTo3D(e.clientX, e.clientY);
    if (!pt) return;
    rulerState.measuring = true; rulerState.p0 = pt.clone(); rulerState.p1 = pt.clone();
    rulerDrag = true; canvas.setPointerCapture(e.pointerId);
    ensureLiveBadge();
    e.stopPropagation();
  }, { capture: true, passive: false });

  canvas.addEventListener('pointermove', e => {
    if (!rulerState.active || !rulerState.measuring || !rulerDrag) return;
    const pt = screenTo3D(e.clientX, e.clientY);
    if (!pt) return;
    rulerState.p1 = pt.clone();
    e.stopPropagation();
  }, { capture: true, passive: false });

  canvas.addEventListener('pointerup', e => {
    if (!rulerState.active || !rulerDrag) return;
    rulerDrag = false;
    if (rulerState.p0 && rulerState.p1) {
      const d = dist3D(rulerState.p0, rulerState.p1);
      if (d > 0.1) {
        const id = Date.now();
        const badge = document.createElement('div');
        badge.className = 'ruler-badge'; badge.textContent = fmtDist(d);
        badge.style.cursor = 'pointer'; badge.title = 'Click to select · click again to delete';
        badge.addEventListener('click', ev => {
          ev.stopPropagation();
          if (rulerState.selected === id) rulerDeleteLine(id);
          else rulerSelectLine(id);
        });
        stage.appendChild(badge);
        rulerLines.push({ id, p0: rulerState.p0.clone(), p1: rulerState.p1.clone(), _dist: d, label: fmtDist(d), _badge: badge });
      }
    }
    rulerState.measuring = false; rulerState.p0 = null; rulerState.p1 = null;
    if (liveBadge) liveBadge.style.display = 'none';
    e.stopPropagation();
  }, { capture: true, passive: false });

  rulerBtn.addEventListener('click', () => {
    rulerState.active = !rulerState.active;
    rulerBtn.setAttribute('aria-pressed', String(rulerState.active));
    rulerBtn.querySelector('i').style.background = rulerState.active ? '#f97316' : '';
    rulerBtn.querySelector('i').style.borderColor = '#f97316';
    rulerHint.style.display = rulerState.active ? 'block' : 'none';
    document.getElementById('ruler-unit-seg').style.display = rulerState.active ? '' : 'none';
    canvas.style.cursor = rulerState.active ? 'crosshair' : '';
    controls.enabled = !rulerState.active && appState.st.mode !== 'walk';
    if (!rulerState.active) {
      rulerState.measuring = false; rulerSVG.innerHTML = '';
      rulerLines.length = 0;
      document.querySelectorAll('.ruler-badge').forEach(b => b.remove());
      if (liveBadge) { liveBadge.remove(); liveBadge = null; }
    }
  });

  rulerBtn.addEventListener('dblclick', () => rulerClearAll());

  function refreshRulerBadgeLabels() {
    rulerLines.forEach(rl => { rl.label = fmtDist(rl._dist); if (rl._badge) rl._badge.textContent = rl.label; });
  }

  const ruFt = document.getElementById('ru-ft'), ruIn = document.getElementById('ru-in');
  ruFt.addEventListener('click', () => {
    rulerState.unit = 'ft'; ruFt.setAttribute('aria-pressed', 'true'); ruIn.setAttribute('aria-pressed', 'false');
    refreshRulerBadgeLabels(); redrawRuler();
  });
  ruIn.addEventListener('click', () => {
    rulerState.unit = 'in'; ruIn.setAttribute('aria-pressed', 'true'); ruFt.setAttribute('aria-pressed', 'false');
    refreshRulerBadgeLabels(); redrawRuler();
  });

  return { rulerState, rulerLines, redrawRuler };
}

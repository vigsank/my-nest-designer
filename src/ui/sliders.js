import { fx, fz } from '../core/coords.js';

export const FSLIDER_DEFS = [
  { key: 'diningW',  label: 'Dining table length', min: 4,   max: 7,   step: 0.5,  unit: "'", room: 'dining' },
  { key: 'diningD',  label: 'Dining table width',  min: 2.5, max: 4.5, step: 0.5,  unit: "'", room: 'dining' },
  { key: 'sofaW',    label: 'Sofa length',          min: 5,   max: 9,   step: 0.5,  unit: "'", room: 'living' },
  { key: 'sofaD',    label: 'Sofa depth',           min: 2,   max: 3.5, step: 0.25, unit: "'", room: 'living' },
  { key: 'bedW',     label: 'Bed width',            min: 4,   max: 7,   step: 0.5,  unit: "'", room: 'bed1' },
  { key: 'bedD',     label: 'Bed length',           min: 5,   max: 7,   step: 0.5,  unit: "'", room: 'bed1' },
  { key: 'counterD', label: 'Counter depth',        min: 1.5, max: 2.5, step: 0.25, unit: "'", room: 'kitchen' },
];

export function updateSliderInfo(key, el, ROOMS, FP) {
  const rm = ROOMS.find(r => FSLIDER_DEFS.find(d => d.key === key && d.room === r.id));
  if (!rm) { el.textContent = ''; return; }
  const rw = rm.x1 - rm.x0, rh = rm.z1 - rm.z0;
  if (key === 'diningW' || key === 'diningD') {
    const clearX = (rw - FP.diningW - 2) / 2, clearZ = (rh - FP.diningD - 2) / 2;
    el.textContent = `Clear: ${clearX.toFixed(1)}' sides · ${clearZ.toFixed(1)}' ends`;
  } else if (key === 'sofaW' || key === 'sofaD') {
    const clearFront = rw - FP.sofaD - 1.5;
    el.textContent = `Front clearance: ${clearFront.toFixed(1)}'`;
  } else if (key === 'bedW' || key === 'bedD') {
    const clearSide = (rw - FP.bedW) / 2;
    el.textContent = `Side clearance: ${clearSide.toFixed(1)}' each`;
  } else if (key === 'counterD') {
    const aisle = rw - FP.counterD * 2;
    el.textContent = `Kitchen aisle: ${aisle.toFixed(1)}'`;
  }
}

export function buildSliders(ROOMS, appState, onRebuild, refreshCardContent) {
  const cont = document.getElementById('fsliders');
  cont.innerHTML = '';
  FSLIDER_DEFS.forEach(def => {
    const wrap = document.createElement('div'); wrap.className = 'fslider';
    const lbl = document.createElement('label'); lbl.textContent = def.label;
    const row = document.createElement('div'); row.className = 'row';
    const inp = document.createElement('input');
    inp.type = 'range'; inp.min = def.min; inp.max = def.max;
    inp.step = def.step; inp.value = appState.FP[def.key];
    const val = document.createElement('span');
    val.className = 'val'; val.textContent = appState.FP[def.key] + def.unit;
    const info = document.createElement('div');
    info.className = 'space-info'; info.id = 'sinfo-' + def.key;
    inp.addEventListener('input', () => {
      appState.FP[def.key] = parseFloat(inp.value);
      val.textContent = inp.value + def.unit;
      onRebuild();
      refreshCardContent();
      updateSliderInfo(def.key, info, ROOMS, appState.FP);
    });
    row.appendChild(inp); row.appendChild(val);
    wrap.appendChild(lbl); wrap.appendChild(row); wrap.appendChild(info);
    cont.appendChild(wrap);
    updateSliderInfo(def.key, info, ROOMS, appState.FP);
  });
}

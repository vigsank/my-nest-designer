import * as THREE from 'three';
import { appState } from './state.js';
import { createMaterials } from './core/materials.js';
import { initScene, applyTheme, resize, startLoop } from './scene.js';
import { FL1 } from './core/coords.js';
import {
  buildFloor as buildGround,
  ROOMS as G_ROOMS, ROOM_LBLS as G_ROOM_LBLS, WIN_LBLS as G_WIN_LBLS, MK_LBLS as G_MK_LBLS,
} from './floors/ground/index.js';
import {
  buildFloor as buildFirst,
  ROOMS as F_ROOMS, ROOM_LBLS as F_ROOM_LBLS, WIN_LBLS as F_WIN_LBLS, MK_LBLS as F_MK_LBLS,
} from './floors/first/index.js';
import { createLabelSystem } from './ui/labels.js';
import { walkStep, applyWalkCam, updateHUD, currentRoom } from './ui/walkMode.js';
import { initRuler } from './ui/ruler.js';
import { initJoineryTooltip } from './ui/joinery-tooltip.js';
import { buildSliders, filterSliders } from './ui/sliders.js';
import { initControls } from './ui/controls.js';

const stage  = document.getElementById('stage');
const canvas = document.getElementById('c');
const lblBox = document.getElementById('labels');

const { renderer, scene, camera, controls, ground } = initScene(canvas, stage);
const M = createMaterials();

// Both floors built at startup; toggled via .visible
// Build first floor first so ground floor's buildStructure runs last → SOL starts as ground
const fFloor = buildFirst(scene, M, appState);
const gFloor = buildGround(scene, M, appState);

// Initial state: ground visible, first hidden
gFloor.structureGrp.visible = true;
gFloor.furnGrp.visible = appState.st.furn;
gFloor.siteGrp.visible = true;
if (gFloor.carGrp) gFloor.carGrp.visible = appState.st.car;

fFloor.structureGrp.visible = false;
fFloor.furnGrp.visible = false;
fFloor.siteGrp.visible = false;

const floorData = {
  ground: { ROOMS: G_ROOMS, ROOM_LBLS: G_ROOM_LBLS, WIN_LBLS: G_WIN_LBLS, MK_LBLS: G_MK_LBLS },
  first:  { ROOMS: F_ROOMS, ROOM_LBLS: F_ROOM_LBLS, WIN_LBLS: F_WIN_LBLS, MK_LBLS: F_MK_LBLS },
};

const labelSystem = createLabelSystem(camera, stage, lblBox, appState, floorData);
labelSystem.buildLabels();

const rulerSVG  = document.getElementById('ruler-svg');
const rulerHint = document.getElementById('ruler-hint');
const rulerBtn  = document.getElementById('ruler-btn');

// initRuler before initControls so ruler capture:true fires first
const { rulerState, rulerLines, redrawRuler } = initRuler(
  canvas, stage, rulerSVG, rulerHint, rulerBtn, camera, scene, controls, appState
);

initJoineryTooltip(canvas, stage, camera, scene, appState, rulerState);

function activeROOMS() {
  return appState.st.floor === 'first' ? F_ROOMS : G_ROOMS;
}

function setFloor(f) {
  appState.st.floor = f;
  const onG = f === 'ground';

  gFloor.structureGrp.visible = onG;
  gFloor.furnGrp.visible = onG && appState.st.furn;
  gFloor.siteGrp.visible = true; // site always visible
  if (gFloor.carGrp) gFloor.carGrp.visible = appState.st.car;

  fFloor.structureGrp.visible = !onG;
  fFloor.furnGrp.visible = !onG && appState.st.furn;
  fFloor.siteGrp.visible = false;

  labelSystem.switchFloor();

  document.querySelectorAll('[data-floor]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.floor === f))
  );

  // reposition camera for the active floor
  const yOff = onG ? 0 : FL1;
  controls.target.set(15, yOff + 2, 25);
  controls.enableDamping = false;
  controls.update();
  controls.enableDamping = true;

  // Repopulate SOL for the newly active floor's collision geometry
  if (onG) gFloor.rebuild(); else fFloor.rebuild();
}

const { setMode } = initControls({
  canvas, stage, camera, controls, appState,
  gFloor, fFloor,
  rulerState,
  activeROOMS,
  filterSliders,
  rebuild() {
    if (appState.st.floor === 'ground') {
      gFloor.rebuild();
      if (appState.st.marks) gFloor.structureGrp.visible = true;
    } else {
      fFloor.rebuild();
      if (appState.st.marks) fFloor.structureGrp.visible = true;
    }
  },
  rebuildFurniture() {
    if (appState.st.floor === 'ground') gFloor.rebuildFurniture();
    else fFloor.rebuildFurniture();
  },
  refreshCardContent: labelSystem.refreshCardContent,
  labelSystem,
  setFloor,
});

// Floor switcher buttons
document.querySelectorAll('[data-floor]').forEach(b =>
  b.addEventListener('click', () => setFloor(b.dataset.floor))
);

buildSliders(G_ROOMS, appState, () => gFloor.rebuildFurniture(), labelSystem.refreshCardContent);

applyTheme(scene, ground);
matchMedia('(prefers-color-scheme:dark)').addEventListener('change', () => applyTheme(scene, ground));
new MutationObserver(() => applyTheme(scene, ground))
  .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

new ResizeObserver(() => resize(renderer, camera, stage)).observe(stage);
resize(renderer, camera, stage);

const clock = new THREE.Clock();
let lastRoomId = null;
let lastMode = null;

startLoop({
  clock,
  renderer, scene, camera, controls, appState,
  walkStep: dt => walkStep(dt, appState),
  applyWalkCam: dt => applyWalkCam(dt, camera, appState),
  updateHUD: () => {
    const ROOMS = activeROOMS();
    updateHUD(ROOMS, appState.FP, appState);
    if (appState.st.mode === 'walk') {
      if (lastMode !== 'walk') { lastRoomId = null; }
      const rm = currentRoom(ROOMS);
      const id = rm ? rm.id : null;
      if (id !== lastRoomId) { lastRoomId = id; filterSliders(id); }
    }
    lastMode = appState.st.mode;
  },
  updateLabels: labelSystem.updateLabels,
  redrawRuler,
  rulerState, rulerLines,
});

setMode('orbit');

document.getElementById('loading').remove();
